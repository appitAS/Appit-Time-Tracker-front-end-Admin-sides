import React, { useState } from "react";
import { Popover, Button, Grid, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from "@mui/icons-material";
import "./Calendar.css"

const Calendar = ({ selectedDate, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [year, setYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());
  const [month, setMonth] = useState(selectedDate?.getMonth() || new Date().getMonth());

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMonthSelect = (index) => {
    console.log(`Selected Month: ${months[index]}, Year: ${year}`);
    setMonth(index);
    onDateChange(new Date(year, index));
    handleClose();
  };

  return (
    <div>
      {/* Calendar Button */}
      <Button
        startIcon={<CalendarToday />}
        onClick={handleOpen}
        sx={{ fontSize: "14px", padding: "6px 12px" }}
      >
        {months[month]} {year}
      </Button>

      {/* Popover for Calendar */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ "& .MuiPaper-root": { borderRadius: 2, width: "220px", padding: "12px" } }} // Compact Width
      >
        <div>
          {/* Year Selector */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={() => setYear(year - 1)} size="small">
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <Typography variant="body1" fontWeight="bold">{year}</Typography>
            <IconButton onClick={() => setYear(year + 1)} size="small">
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </div>

          {/* Month Selection Grid */}
          <Grid container spacing={1} sx={{ marginTop: 1 }}>
            {months.map((m, index) => (
              <Grid item xs={4} key={m}>
                <Button
                  variant={index === month ? "contained" : "text"}
                  color={index === month ? "warning" : "default"}
                  sx={{
                    minWidth: "40px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: index === month ? "bold" : "normal",
                  }}
                  onClick={() => handleMonthSelect(index)}
                >
                  {m}
                </Button>
              </Grid>
            ))}
          </Grid>
        </div>
      </Popover>
    </div>
  );
};

export default Calendar;
