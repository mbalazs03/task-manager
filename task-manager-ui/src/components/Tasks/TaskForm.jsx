import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ task = {}, onSave }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (task.id) {
        // Edit task
        await axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
          title,
          description,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create task
        await axios.post("http://localhost:8080/api/tasks", {
          title,
          description,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">{task.id ? "Update" : "Create"} Task</button>
    </form>
  );
};

export default TaskForm;
