import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
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
  const [isDark, setIsDark] = useState(false); // Added useState for dark mode

  const toggleDarkMode = () => { // Added toggleDarkMode function
      setIsDark(!isDark);
      document.documentElement.classList.toggle('dark');
    };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    console.log("userRole:", userRole); // Debugging
    if (!token) {
      navigate("/login");
    } else {
      setIsAdmin(userRole === "ADMIN");
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const endpoint = isAdmin ? "/admin/tasks" : "/tasks";
      const response = await api.get(endpoint);
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

   if (isAdmin === null) {
     return <div>Loading...</div>; // Wait until isAdmin is determined
   }

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
          <Box>
            {isAdmin && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/admin")}
                sx={{ marginRight: 2 }}
                startIcon={<SupervisorAccount />}
              >
                Go to Admin Page
              </Button>
            )}
          <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        <List>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={fetchTasks}
              onDelete={fetchTasks}
              isAdmin={isAdmin}
            />
          ))}
        </List>
      </Container>

      <TaskForm
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={fetchTasks}
      />
    </Box>
  );
};

export default TaskList;

