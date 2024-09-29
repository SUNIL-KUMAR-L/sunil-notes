package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    // Explicit constructor
    public CorsConfig() {
        super(); // Call to the superclass constructor
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow all origins (for development purposes)
        registry.addMapping("/**")
                .allowedOrigins("*") // Change "*" to specific origins in production
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        // ... existing code ...
    }
}
