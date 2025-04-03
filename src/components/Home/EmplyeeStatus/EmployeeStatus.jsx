import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
 import socket from "../../../socket";

const Members = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [membersData, setMembersData] = useState(
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("gettimerUpdate", (data) => {
      console.log("Received employee status:", data);
      setMembersData(data);
    });

    return () => {
      socket.off("gettimerUpdate");
      socket.off("connect");
    };
  }, []);

  // Filter employees
  const onlineEmployees = membersData.filter((emp) => emp.loginAt?.length > 0);
  const offlineEmployees = membersData.filter((emp) => !emp.loginAt?.length);
  const totalEmployees = membersData.length;

  const filteredMembers = activeTab === 0 ? onlineEmployees : offlineEmployees;

  const searchedMembers = filteredMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        maxWidth: 400,
        bgcolor: "#fff",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        overflowX: "auto", maxHeight: "400px", overflowY: "auto" 
      }}
    >
      <Typography variant="h6" textAlign="center">
        Who's in/out
      </Typography>
      <Typography variant="body2" textAlign="center" color="gray">
        {totalEmployees} members
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "orange" },
          "& .MuiTab-root": {
            color: "#999",
            fontWeight: "bold",
            transition: "color 0.3s ease",
            "&:hover": { color: "orange", textDecoration: "underline" },
            "&.Mui-selected": { color: "orange", backgroundColor: "#FFF5EB" },
          },
        }}
      >
        <Tab label={`Online (${onlineEmployees.length})`} />
        <Tab label={`Offline (${offlineEmployees.length})`} />
      </Tabs>

      <TextField
        fullWidth
        size="small"
        placeholder="Search members..."
        sx={{ mt: 1, mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <List>
        {searchedMembers.length > 0 ? (
          searchedMembers.map((member, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: "8px",
                transition: "background 0.3s ease",
                "&:hover": { bgcolor: "#FFF4E5" },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#ddd", color: "#000" }}>
                  {member.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={activeTab === 0 && member.loginAt ? `Login: ${member.loginAt.join(", ")}` : null}
              />
            </ListItem>
          ))
        ) : (
          <Typography textAlign="center" sx={{ mt: 2 }}>
            No members found
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Members;
