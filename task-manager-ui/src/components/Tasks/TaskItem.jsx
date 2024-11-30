import React from "react";
import TaskForm from "./TaskForm";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(!isEditing);
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
    <li>
      {isEditing ? (
        <TaskForm
          task={task}
          onSave={() => {
            setIsEditing(false);
            onUpdate();
          }}
        />
      ) : (
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
