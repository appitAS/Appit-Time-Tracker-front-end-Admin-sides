import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL; // ✅ Use import.meta.env for Vite

const UserForm = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/registeradmin`,
        user
      );

      setResponseMessage(response.data.message); // Show backend message
      setResponseStatus(response.data.status);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setResponseMessage(
        error.response?.data?.message || "❌ Error creating user."
      );
      setResponseStatus("failure");
    }

    // Hide message after 3 seconds
    setTimeout(() => {
      setResponseMessage("");
      setResponseStatus(null);
    }, 3000);
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: "300px",
        padding: "20px",
        margin: "50px auto",
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create User
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        variant="outlined"
        size="small"
        value={user.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        variant="outlined"
        size="small"
        value={user.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Create
      </Button>

      {responseMessage && (
        <Alert
          severity={responseStatus === "success" ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {responseMessage}
        </Alert>
      )}
    </Box>
  );
};

export default UserForm;
