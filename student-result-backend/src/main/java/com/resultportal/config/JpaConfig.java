package com.resultportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA configuration.
 * Enables Spring Data JPA repositories and declarative transaction management.
 * Hibernate DDL and dialect settings are in application.properties.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.resultportal.repository")
@EnableTransactionManagement
public class JpaConfig {
    // Additional JPA customization (e.g., custom auditing) can be added here
}
