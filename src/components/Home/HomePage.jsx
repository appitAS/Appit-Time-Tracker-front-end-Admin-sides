import React, { useState, useEffect } from "react";
import EmployeeStatus from "./EmplyeeStatus/EmployeeStatus";
import socket from "../../socket";

const TimerDisplay = () => {
  const [workTime, setWorkTime] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function formatTime(ms) {
    if (!ms) return "00:00:00";
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Helper function to format time (seconds -> HH:MM:SS)
  const formatIdleTime = (seconds) => {
    if (!seconds) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("gettimerUpdate", (data) => {
      console.log(`Timer update received:`, data);
      setWorkTime(data);
    });

    return () => {
      socket.off("gettimerUpdate");
      socket.off("connect");
    };
  }, []);

  const filteredWorkTime = workTime.filter(
    (e) =>
      e.name.toLowerCase().includes(name.toLowerCase()) &&
      e.email.toLowerCase().includes(email.toLowerCase())
  );

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div style={{ display:'flex',gap:"2rem", maxWidth: "100%", margin: "auto",  padding: "25px", borderRadius: "12px" }}>
      <div>
      <h2 style={{ textAlign: "center", fontSize: "26px", color: "#2c3e50", fontWeight: "bold", marginBottom: "20px" }}>Employee Work Time Tracking</h2>
      <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: "12px", width: "220px", border: "2px solid #3498db", borderRadius: "6px", fontSize: "16px", outline: "none" }}
        />
        <input
          type="text"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ padding: "12px", width: "220px", border: "2px solid #3498db", borderRadius: "6px", fontSize: "16px", outline: "none" }}
        />
        <button type="submit" style={{ background: "#3498db", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "6px", cursor: "pointer", fontSize: "16px", transition: "0.3s", fontWeight: "bold" }}>Search</button>
      </form>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <thead>
            <tr style={{ background: "#3498db", color: "#fff", fontWeight: "bold" }}>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Work Time</th>
              <th>Break Time</th>
              <th>Total Idle Time</th>
              <th>Idle Message</th>
              <th>Login At</th>
              <th>Log Out At</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkTime.map((e) => (
              <tr key={e.email} style={{ borderBottom: "1px solid #ddd", transition: "0.3s", textAlign: "center" }}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.date}</td>
                <td>{formatTime(e.WorkTime)}</td>
                <td>{formatTime(e.BreakTime)}</td>
                <td>{formatIdleTime(e.totalIdleTime)}</td>
                <td>{Array.isArray(e.idleMsg) ? e.idleMsg.join(", ").replace(/\s+/g, " ") : "N/A"}</td>
                <td>{e.loginAt}</td>
                <td>{e.logOutAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <EmployeeStatus />
    </div>
  );
};

export default TimerDisplay;