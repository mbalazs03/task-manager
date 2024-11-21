package com.example.taskify.data.repository;

import com.example.taskify.data.entity.TaskEntitiy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntitiy, Long> {

    List<TaskEntitiy> findByUserId(Long userId);

}
