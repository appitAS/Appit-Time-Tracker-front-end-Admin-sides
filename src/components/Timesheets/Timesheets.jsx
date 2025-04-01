import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./Timesheets.css";
import Calendar from "./CalenderFilter/Calendar"

function Timesheets() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [timeSheetData, setTimeSheetData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState("");
  


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

  // Helper function to format time (ms -> HH:MM:SS)
  function formatTime(ms) {
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // Function to fetch data
  const fetchData = async (requestData) => {
    console.log("requestData->",requestData)
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/timeSheet/employeeTimesheet",
        requestData
      );

      if (response.data.status === "success") {
        setTimeSheetData(response.data.data);
        console.log("timeSheetData->",response.data.data)
      } else {
        setTimeSheetData(null);
        setErrorMessage(response.data.message || "No records found.");
      }
    } catch (err) {
      setErrorMessage("Failed to fetch timesheet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component loads (empty request initially)
  // useEffect(() => {
  //   fetchData({month:"Feb",year:"2025"});
  // }, []);

  // Handle submit button click
  const handleSubmit = () => {
    fetchData({name,email,date});
    setTimeSheetData(null);
    setName("")
    setEmail("")
    setDate("")
  };

  const handleNameChange = (e) => setName(e.target.value.trim());
  const handleEmailChange = (e) => setEmail(e.target.value.trim());
  const handleDateChange = (e) => setDate(e.target.value.trim());

  return (
    <div className="time-sheets-fz-main-container">
      <h4 className="time-sheets-fz-text">Timesheet</h4>
      <div className="time-sheets-fz-container">
        {/* Filters */}
        <div className="time-sheets-fz-container-filters">
          <div className="input-group">
            <label>Name</label>
            <input
              className="time-sheets-fz-container-input"
              type="text"
              placeholder="Employee name"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              className="time-sheets-fz-container-input"
              type="Email"
              placeholder="Employee email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {/* Day Input */}
          <div className="input-group">
            <label>Day</label>
            <input
              className="time-sheets-fz-container-input"
              type="date"
              value={date}
              onChange={handleDateChange}
            />
          </div>

          <div className="input-group">
            <label>Month</label>
           <Calendar/>
          </div>
          
        </div>
        {/* Buttons */}
        <div className="buttons-container">
          <button
            className="appit-time-tracker-by-fz-time-sheets-btn"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            style={{ background: "#cbe3bf", color: "#2a2a2a" }}
            className="appit-time-tracker-by-fz-time-sheets-btn"
          >
            Export
          </button>
        </div>
         {/* Results Table */}
         <div className="time-sheets-fz-container-table">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {timeSheetData && timeSheetData.length > 0 ?(
            <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Total Work Time</th>
                <th>Total Break Time</th>
                <th>Total Idle Time</th>
                <th>Login At</th>
                <th>Logout At</th>
                <th>Idle Messages</th>
              </tr>
            </thead>
            <tbody>
              {timeSheetData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{formatTime(entry.WorkTime)}</td>
                  <td>{formatTime(entry.BreakTime)}</td>
                  <td>{formatIdleTime(entry.totalIdleTime)}</td>
                  <td>{entry.loginAt ? entry.loginAt.join(", ") : "N/A"}</td>
                  <td>{entry.loginAt ? entry.logOutAt.join(", ") : "N/A"}</td>
                  <td>
                    {entry.idleMsg.length > 0
                      ? entry.idleMsg.join(", ")
                      : "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ):(!errorMessage && <p>No data available</p>)}
         </div>
         <div className="">

         </div>
      </div>
    </div>
  );
}

export default Timesheets;
