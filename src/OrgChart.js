import React, { useEffect, useState, useCallback, useRef } from "react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "reactflow";
import { Controls } from "@reactflow/controls";
import { Background } from "@reactflow/background";
import dagre from "dagre";
import "reactflow/dist/style.css";
import "./OrgChart.css";

// Node dimensions
const nodeWidth = 280;
const nodeHeight = 120;

// Dagre layout function
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB", // "TB" = Top-to-Bottom
    ranksep: 150,  // ⬆️ Increased spacing between hierarchy levels
    nodesep: 30,   // ⬇️ Reduced spacing between employees under the same manager
    ranker: "network-simplex", // ⬆️ Ensures better vertical alignment
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    }),
    edges,
  };
};


const OrgChartComponent = () => {
  const { project, fitView } = useReactFlow();
  const containerRef = useRef();
  const [employees, setEmployees] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  // Fetch employee data
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((json) => setEmployees(json.employees))
      .catch(console.error);
  }, []);

  const handleNodeDragStart = useCallback((_, node) => {
    setDraggingId(node.id);
  }, []);

  const handleNodeDragStop = useCallback(
    (event, node) => {
      if (!containerRef.current) return;

      const reactFlowBounds = containerRef.current.getBoundingClientRect();
      const mousePosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const targetPosition = project(mousePosition);

      const targetNode = nodes.find((n) => {
        const nodeRight = n.position.x + nodeWidth;
        const nodeBottom = n.position.y + nodeHeight;
        return (
          targetPosition.x >= n.position.x &&
          targetPosition.x <= nodeRight &&
          targetPosition.y >= n.position.y &&
          targetPosition.y <= nodeBottom &&
          n.id !== node.id
        );
      });

      if (targetNode) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id.toString() === node.id
              ? { ...emp, manager: parseInt(targetNode.id, 10) }
              : emp
          )
        );
      }

      setDraggingId(null);
    },
    [nodes, project]
  );

  // Build nodes & edges from employees
  useEffect(() => {
    if (employees.length === 0) return;

    const newNodes = employees.map((emp) => ({
      id: emp.id.toString(),
      data: {
        label: (
          <div
            className={`node-container ${
              draggingId === emp.id.toString() ? "dragging" : ""
            }`}
          >
            <img
              src={
                emp.image ||
                `https://via.placeholder.com/80/AAAAAA/fff?text=${emp.name[0]}`
              }
              alt={emp.name}
              className="node-avatar"
            />
            <div className="node-content">
              <h3 className="node-name">{emp.name}</h3>
              <span className="node-designation">{emp.designation}</span>
            </div>
            {emp.team && <span className="node-team">{emp.team}</span>}
          </div>
        ),
      },
      position: { x: 0, y: 0 },
    }));

    const newEdges = employees
      .filter((emp) => emp.manager)
      .map((emp) => ({
        id: `e${emp.manager}-${emp.id}`,
        source: emp.manager.toString(),
        target: emp.id.toString(),
        type: "straight",
      }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [employees, draggingId]);

  // Fit the view when nodes update
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2 });
        
      }, 200);
    }
  }, [nodes, fitView]);

  return (
    <ReactFlow
      ref={containerRef}
      nodes={nodes}
      edges={edges}
      onNodeDragStart={handleNodeDragStart}
      onNodeDragStop={handleNodeDragStop}
      fitView
      nodesDraggable
      elementsSelectable
      defaultEdgeOptions={{
        type: "straight",
        style: { stroke: "#CBD5E0", strokeWidth: 2 },
      }}
    >
      {/* ❌ Removed MiniMap */}
      
      <Controls
        style={{
          bottom: 25,
          right: 20,
        }}
      />
      <Background color="#CBD5E0" gap={40} variant="dots" />
    </ReactFlow>
  );
};

const OrgChart = () => {
  return (
    <div className="orgchart-container">
      <ReactFlowProvider>
        <OrgChartComponent />
      </ReactFlowProvider>
    </div>
  );
};

export default OrgChart;
