import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";

const TaskForm = ({ task = {}, onSave, open, onClose }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [deadline, setDeadline] = useState(task.deadline ? dayjs(task.deadline) : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = { title, description, deadline: deadline ? deadline.toISOString() : null, };
      if (task.id) {
        await axios.put(`http://localhost:8080/api/tasks/${task.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:8080/api/tasks", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{task.id ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              multiline
              minRows={4}
            />
            <DatePicker
              label="Deadline"
              value={deadline}
              onChange={(newDate) => setDeadline(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {task.id ? "Update" : "Create"} Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskForm;
