import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, CardActions, Box } from "@mui/material";
import TaskForm from "./TaskForm";

const TaskItem = ({ task, username, onUpdate, onDelete, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{isAdmin && <p><strong>Assigned to:</strong> {username || "Unassigned"}</p>}</Typography>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
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
