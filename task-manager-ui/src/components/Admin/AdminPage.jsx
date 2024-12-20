import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const { userRole, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "ADMIN") {
      navigate("/tasks");
    } else {
      fetchAdminData();
    }
  }, [userRole, navigate]);

  const fetchAdminData = async () => {
    try {
      const [userResponse, taskResponse] = await Promise.all([
        api.get("/admin/users", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        api.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);
      setUsers(userResponse.data);
      setTasks(taskResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch admin data. Ensure you have admin access."
      );
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/admin/tasks/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(
        `/admin/users/${userId}/role`,
        newRole,  // Send newRole directly as the request body
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'text/plain'  // Change content type to text/plain
          }
        }
      );
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      alert('User role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      alert(err.response?.data?.message || "Failed to update user role.");
    }
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Users
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="USER">User</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Tasks
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.username}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AdminPage;

