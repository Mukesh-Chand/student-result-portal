package com.resultportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Student Result Portal application.
 * Spring Boot auto-configuration handles component scanning,
 * JPA, Security, and Web MVC setup.
 */
@SpringBootApplication
public class StudentResultPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentResultPortalApplication.class, args);
    }
}
