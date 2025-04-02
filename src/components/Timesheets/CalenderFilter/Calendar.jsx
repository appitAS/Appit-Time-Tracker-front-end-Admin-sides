import React, { useState, useEffect } from "react";
import { Popover, Button, Grid, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from "@mui/icons-material";
import "./Calendar.css";

const Calendar = ({ onDateChange }) => {
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1; // December if January
  const prevYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  const [anchorEl, setAnchorEl] = useState(null);
  const [year, setYear] = useState(prevYear);
  const [month, setMonth] = useState(prevMonth);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Example: April (3)

  // Set default selected month on mount
  useEffect(() => {
    if (onDateChange) {
      onDateChange({ month: months[prevMonth], year: prevYear });
    }
  }, []);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMonthSelect = (index) => {
    if (year === currentYear && index >= currentMonth) return; // Restrict selection of current/future months

    setMonth(index);
    const selectedDate = { month: months[index], year: year };

    if (onDateChange) {
      onDateChange(selectedDate);
    }

    handleClose();
  };

  return (
    <div>
      <Button 
        startIcon={<CalendarToday />} 
        onClick={handleOpen} 
        sx={{ fontSize: "14px", padding: "6px 12px", textTransform: "none" }}
      >
        {months[month]} {year}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            width: "240px",
            padding: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <div style={{ padding: "10px" }}>
          {/* Year Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={() => setYear(year - 1)} size="small">
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <Typography variant="body1" fontWeight="bold">{year}</Typography>
            <IconButton 
              onClick={() => setYear(year + 1)} 
              size="small" 
              disabled={year >= currentYear} // Prevent moving to future years
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </div>

          {/* Month Selection */}
          <Grid container spacing={1} sx={{ marginTop: 1 }}>
            {months.map((m, index) => {
              const isDisabled = year === currentYear && index >= currentMonth; // Disable current/future months
              
              return (
                <Grid item xs={4} key={m}>
                  <Button 
                    variant={index === month ? "contained" : "text"} 
                    color={index === month ? "primary" : "default"}
                    disabled={isDisabled}
                    sx={{
                      minWidth: "40px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      fontWeight: index === month ? "bold" : "normal",
                      borderRadius: "6px",
                      opacity: isDisabled ? 0.5 : 1, // Gray out disabled months
                    }}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {m}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Popover>
    </div>
  );
};

export default Calendar;
