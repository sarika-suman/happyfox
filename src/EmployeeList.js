import React, { useState, useEffect } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((json) => setEmployees(json.employees))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  if (employees.length === 0) {
    return <div className="loading">Loading employee data...</div>;
  }

  const teams = ["All", ...new Set(employees.map((emp) => emp.team))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesTeam = selectedTeam === "All" || emp.team === selectedTeam;
    const matchesSearch = Object.values(emp)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Employee Directory</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="team-select"
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="employee-list">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="employee-info">
              <h3 className="employee-name">{emp.name}</h3>
              <p className="employee-designation">{emp.designation}</p>
            </div>
            <div className="employee-team">{emp.team}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = `
/* Modern, clean color palette */
:root {
  --primary: #2F80ED;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --border: #EAEAEA;
  --background: #F8FAFC;
}

/* Base reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
}

/* Sidebar styling */
.sidebar {
  width: 360px;
  height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.sidebar-title {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #A0AEC0;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(47, 128, 237, 0.1);
}

.team-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: var(--text-primary);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

/* Employee list items */
.employee-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.employee-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 4px 0;
  background: white;
  border-radius: 6px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  cursor: pointer;
}

.employee-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border-color: var(--primary);
}

.employee-info {
  flex: 1;
  min-width: 0;
}

.employee-name {
  margin: 0 0 2px 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
}

.employee-designation {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.2;
}

.employee-team {
  margin-left: 8px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(47, 128, 237, 0.08);
}

/* Loading state */
.loading {
  padding: 12px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-align: center;
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export default EmployeeList;
