import React from "react";
import "./MonthFilters.css"; // Import the external CSS

function MonthFiletrs({ monthData }) {
  return (
    <div>
      <table className="month-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Total Work Hours</th>
            <th>Total Present Days</th>
            <th>Total Absent Days</th>
            <th>Absent Dates</th>
            <th>Present Dates</th>
            <th>Saturday/Sunday Holidays</th>
          </tr>
        </thead>
        <tbody>
          {monthData.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.totalWorkTime}</td>
              <td>{entry.totalPresent}</td>
              <td>{entry.totalAbsent}</td>

              {/* Absent Days */}
              <td>
                {entry.absentDays.map((date, idx) => (
                  <span key={idx} className="date-box absent" title={date}></span>
                ))}
              </td>

              {/* Present Days */}
              <td>
                {entry.presentDays.map((date, idx) => (
                  <span key={idx} className="date-box present" title={date}></span>
                ))}
              </td>

              {/* Holidays */}
              <td>
                {entry.satSunHolidays.map((date, idx) => (
                  <span key={idx} className="date-box holiday" title={date}></span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MonthFiletrs;
