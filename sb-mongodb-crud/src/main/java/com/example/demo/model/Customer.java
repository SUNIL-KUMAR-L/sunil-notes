package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "customers")
public class Customer {
    @Id
    private String id;
    private String name;
    private int age;
    private String email;
    private LocalDate dateOfBirth;
    private LocalDateTime joinedDatetime;
    private boolean employeeFlag;

    // Getters and Setters
}
