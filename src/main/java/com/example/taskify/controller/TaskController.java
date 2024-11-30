package com.example.taskify.controller;

import com.example.taskify.data.entity.TaskEntity;
import com.example.taskify.data.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public TaskEntity createTask(@RequestBody TaskEntity taskEntity) {
        return taskRepository.save(taskEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long id, @RequestBody TaskEntity taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(taskDetails.getTitle());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setDeadline(taskDetails.getDeadline());
                    return ResponseEntity.ok(taskRepository.save(existingTask));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
