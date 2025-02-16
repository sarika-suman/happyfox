import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import EmployeeList from "./EmployeeList";
import OrgChart from "./OrgChart";

function App() {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      <Paper
        elevation={3}
        sx={{
          width: "370px", 
          borderRight: "1px solid #ccc",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          backgroundColor: "#fff",
        }}
      >
        <EmployeeList />
      </Paper>

     
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
        }}
      >
       
        <Box
          sx={{
            textAlign: "center",
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#1e293b",
            p: 2,
            backgroundColor: "#ffffff",
            borderBottom: "2px solid #e2e8f0",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Slight shadow for separation
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Organization Chart
          </Typography>
        </Box>

       
        <Box sx={{ flex: 1, position: "relative", overflow: "hidden", p: 2 }}>
          <OrgChart />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
