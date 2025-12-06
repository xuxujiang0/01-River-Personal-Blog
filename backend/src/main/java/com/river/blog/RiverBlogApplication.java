package com.river.blog;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * River Personal Blog - Main Application
 * 
 * @author River
 * @version 1.0.0
 */
@SpringBootApplication
@MapperScan("com.river.blog.mapper")
public class RiverBlogApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(RiverBlogApplication.class, args);
    }
}
