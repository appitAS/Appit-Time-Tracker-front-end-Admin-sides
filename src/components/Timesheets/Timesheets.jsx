import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Timesheets.css";
import Calendar from "./CalenderFilter/Calendar";
import MonthFiletrs from "./MonthFilters/MonthFiletrs";
let baseUrl = import.meta.env.VITE_API_URL; // ✅ Use import.meta.env for Vite

function Timesheets() {
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1; // December if January
  const prevYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [monthData, setMonthData] = useState(null);
  const [timeSheetData, setTimeSheetData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({
    month: prevMonth,
    year: prevYear,
  });
  const [isFirstRender, setIsFirstRender] = useState(true);

  const formatTime = (ms) => {
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const formatIdleTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const fetchData = async (requestData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${baseUrl}/api/timeSheet/employeeTimesheet`,
        requestData
      );

      if (response.data.status === "success") {
        if (requestData.month) {
          setMonthData(response.data.employees);
          setTimeSheetData(null);
        } else {
          setTimeSheetData(response.data.data);
          setMonthData(null);
        }
      } else {
        setTimeSheetData(null);
        setMonthData(null);
        setErrorMessage(response.data.message || "No records found.");
      }
    } catch (err) {
      setErrorMessage("Failed to fetch timesheet data. Please try again.");
      setTimeSheetData(null);
      setMonthData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedMonth) {
      const { month, year } = selectedMonth;
      fetchData({ month, year });
      setSelectedMonth("");
    } else if (name || email || date) {
      fetchData({ name, email, date });
      setDate("");
      setEmail("");
      setName("");
    } else {
      setErrorMessage("Please enter a filter before submitting.");
    }
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      handleSubmit();
    }
  }, [selectedMonth]);

  return (
    <div className="time-sheets-fz-main-container">
      <h4 className="time-sheets-fz-text">Timesheet</h4>
      <div className="time-sheets-fz-container">
        <div className="time-sheets-fz-container-filters">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Employee name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Employee email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div className="input-group">
            <label>Day</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value.trim())}
            />
          </div>
          <div className="input-group">
            <label>Month</label>
            <Calendar onDateChange={setSelectedMonth} />
          </div>
        </div>
        <div className="buttons-container">
          <button
            className="appit-time-tracker-by-fz-time-sheets-btn"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="time-sheets-fz-container-table">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {timeSheetData && (
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Work Time</th>
                  <th>Total Break Time</th>
                  <th>Total Idle Time</th>
                  <th>Login At</th>
                  <th>Logout At</th>
                </tr>
              </thead>
              <tbody>
                {timeSheetData.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    <td>{entry.date}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{formatTime(entry.WorkTime)}</td>
                    <td>{formatTime(entry.BreakTime)}</td>
                    <td>
                      {entry.totalIdleTime
                        ? formatIdleTime(entry.totalIdleTime)
                        : "00:00:00"}
                    </td>

                    <td>{entry.loginAt ? entry.loginAt.join(", ") : "N/A"}</td>
                    <td>
                      {entry.logOutAt ? entry.logOutAt.join(", ") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {monthData && <MonthFiletrs monthData={monthData} />}
        </div>
      </div>
    </div>
  );
}

export default Timesheets;
