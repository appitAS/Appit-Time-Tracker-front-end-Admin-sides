import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
} from "@mui/material";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const daysInMonth = 31;
const attendanceStates = ["", "R", "A", "H"];

const initialEmployees = [
  { name: "B Aravind Kumar", initial: "B", records: Array(daysInMonth).fill("") },
  { name: "Baswani Tilak Balu", initial: "B", records: Array(daysInMonth).fill("") },
  { name: "chakali shiva", initial: "C", records: Array(daysInMonth).fill("") },
  { name: "Chandu Nidumolu", initial: "C", records: Array(daysInMonth).fill("") },
];

const Employees = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  const toggleAttendance = (empIndex, dayIndex) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp, i) =>
        i === empIndex
          ? {
              ...emp,
              records: emp.records.map((r, j) =>
                j === dayIndex
                  ? attendanceStates[(attendanceStates.indexOf(r) + 1) % attendanceStates.length]
                  : r
              ),
            }
          : emp
      )
    );
  };

  return (
    <Box p={2} sx={{ overflowX: "auto" }}>
     
      
      <TableContainer component={Paper}>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150, fontWeight: "bold" }}>Employee</TableCell>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <TableCell key={i} align="center" sx={{ minWidth: 30, padding: "5px" }}>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: "#888" }}>
                    {daysOfWeek[i % 7]}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: new Date().getDate() === i + 1 ? "bold" : 400,
                      color: new Date().getDate() === i + 1 ? "#fff" : "#444",
                      bgcolor: new Date().getDate() === i + 1 ? "#3f51b5" : "transparent",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </Typography>
                </TableCell>
              ))}
              {/* New columns for totals */}
              <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 60 }}>Work Hrs</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 60 }}>Present</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 60 }}>Absent</TableCell>
            </TableRow>
          </TableHead>

          {/* Employee Attendance Records */}
          <TableBody>
            {employees.map((emp, empIndex) => {
              const totalPresent = emp.records.filter((r) => r === "R").length;
              const totalAbsent = emp.records.filter((r) => r === "A").length;
              const totalWorkHours = totalPresent * 8; // Assuming 8 hours per workday

              return (
                <TableRow key={empIndex} hover>
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 150 }}>
                    <Avatar sx={{ bgcolor: "#ddd", width: 32, height: 32, fontSize: "14px" }}>
                      {emp.initial}
                    </Avatar>
                    <Typography>{emp.name}</Typography>
                  </TableCell>

                  {emp.records.map((record, dayIndex) => (
                    <TableCell key={dayIndex} align="center" sx={{ padding: "5px" }}>
                      <Box
                        sx={{
                          width: 25,
                          height: 25,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          bgcolor:
                            record === "R"
                              ? "#4CAF50"
                              : record === "A"
                              ? "#F44336"
                              : record === "H"
                              ? "#FFC107"
                              : "#F5F5F5",
                          color: record ? "#fff" : "#000",
                          borderRadius: 1,
                          transition: "background 0.3s ease",
                          "&:hover": { opacity: 0.8 },
                        }}
                        onClick={() => toggleAttendance(empIndex, dayIndex)}
                      >
                        {record}
                      </Box>
                    </TableCell>
                  ))}

                  {/* New columns with totals */}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalWorkHours}h</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalPresent}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>{totalAbsent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
    </Box>
  );
};

export default Employees;
