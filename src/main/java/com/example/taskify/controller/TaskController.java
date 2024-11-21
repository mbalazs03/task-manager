package com.example.taskify.controller;

import com.example.taskify.data.entity.TaskEntitiy;
import com.example.taskify.data.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<TaskEntitiy> getAllTasks() {
        return taskRepository.findAll();
    }

    public TaskEntitiy createTask(@RequestBody TaskEntitiy taskEntitiy) {
        return taskRepository.save(taskEntitiy);
    }

    @PutMapping("/{id}")
    public TaskEntitiy updateTask(@PathVariable Long id, @RequestBody TaskEntitiy taskDetails) {
        TaskEntitiy taskEntitiy = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found!"));
        taskEntitiy.setTitle(taskDetails.getTitle());
        taskEntitiy.setDescription(taskDetails.getDescription());
        taskEntitiy.setDeadline(taskDetails.getDeadline());
        return taskRepository.save(taskEntitiy);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return "Task deleted Successfully!";
    }

}
