import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import TaskForm from "./TaskForm";
import { reassignTask } from "../../services/api";

const TaskItem = ({ task, onUpdate, onDelete, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(task.userEntity?.id || '');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(task.id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleReassign = async (userId) => {
    try {
      if (!userId) {
        console.warn("No valid user selected.");
        return;
      }
      await reassignTask(task.id, userId);
      setSelectedUserId(userId);
      onUpdate();
    } catch (err) {
      console.error("Failed to reassign task:", err);
    }
  };


  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          {isAdmin ? (
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Assigned to</InputLabel>
              <Select
                value={selectedUserId || ''}
                onChange={(e) => handleReassign(e.target.value)}
                label="Assigned to"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Box>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
        {task.deadline && (
          <Typography variant="body2" color="textSecondary">
            <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button variant="outlined" color="primary" onClick={handleEditToggle}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>

      {isEditing && (
        <TaskForm
          open={isEditing}
          task={task}
          onClose={handleEditToggle}
          onSave={() => {
            setIsEditing(false);
            onUpdate();
          }}
        />
      )}
    </Card>
  );
};

export default TaskItem;