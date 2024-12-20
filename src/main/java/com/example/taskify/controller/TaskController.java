package com.example.taskify.controller;

import com.example.taskify.data.entity.TaskEntity;
import com.example.taskify.data.entity.UserEntity;
import com.example.taskify.data.repository.TaskRepository;
import com.example.taskify.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(auth.getName());

        if (user.isAdmin()) {
            return ResponseEntity.ok(taskRepository.findAll());
        } else {
            return ResponseEntity.ok(taskRepository.findByUserEntity_Id(user.getId()));
        }
    }

    @PostMapping
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity taskEntity) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(auth.getName());
        taskEntity.setUserEntity(user);
        return ResponseEntity.ok(taskRepository.save(taskEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long id, @RequestBody TaskEntity taskDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(auth.getName());

        return (ResponseEntity<TaskEntity>) taskRepository.findById(id)
                .map(existingTask -> {
                    if (!user.isAdmin() && !existingTask.getUserEntity().getId().equals(user.getId()))
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    existingTask.setTitle(taskDetails.getTitle());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setDeadline(taskDetails.getDeadline());
                    return ResponseEntity.ok(taskRepository.save(existingTask));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(auth.getName());

        return taskRepository.findById(id)
                .map(task -> {
                    if (!user.isAdmin() && !task.getUserEntity().getId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

