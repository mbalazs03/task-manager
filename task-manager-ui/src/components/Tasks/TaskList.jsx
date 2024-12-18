import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  List,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { Logout, Add, SupervisorAccount } from "@mui/icons-material";
import api from "../../services/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token) {
      navigate("/login");
    } else {
      setIsAdmin(userRole === "ADMIN");
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      await api.post("/tasks", newTask);
      fetchTasks();
      setAddDialogOpen(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleUpdateTaskList = () => fetchTasks();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      alert("You have logged out successfully!");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task List
          </Typography>
          {isAdmin && (
            <IconButton color="inherit" onClick={() => navigate("/admin")}>
              <SupervisorAccount />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Your Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Task
          </Button>
        </Box>

        <List>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdateTaskList}
              onDelete={handleUpdateTaskList}
              isAdmin={isAdmin}
            />
          ))}
        </List>
      </Container>

      <TaskForm
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleUpdateTaskList}
      />
    </Box>
  );
};

export default TaskList;

