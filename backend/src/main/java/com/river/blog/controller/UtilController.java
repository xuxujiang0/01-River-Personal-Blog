package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.entity.User;
import com.river.blog.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 工具Controller - 用于开发调试
 * 
 * @author River
 */
@RestController
@RequestMapping("/util")
public class UtilController {
    
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    public UtilController(PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }
    
    /**
     * 生成BCrypt密码哈希
     * 访问: GET /api/util/generate-password?password=admin123
     */
    @GetMapping("/generate-password")
    public Result<Map<String, Object>> generatePassword(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        
        Map<String, Object> result = new HashMap<>();
        result.put("plainPassword", password);
        result.put("bcryptHash", hash);
        result.put("sql", "UPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
        
        return Result.success(result);
    }
    
    /**
     * 测试密码匹配
     * 访问: POST /api/util/test-password
     * Body: {"password":"admin123", "hash":"$2a$10$..."}
     */
    @PostMapping("/test-password")
    public Result<Map<String, Object>> testPassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hash = request.get("hash");
        
        boolean matches = passwordEncoder.matches(password, hash);
        
        Map<String, Object> result = new HashMap<>();
        result.put("password", password);
        result.put("hash", hash);
        result.put("matches", matches);
        
        return Result.success(result);
    }
    
    /**
     * 健康检查接口
     * 访问: GET /api/util/health
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("service", "river-blog-backend");
        
        // 检查数据库连接
        try {
            userMapper.selectByUsername("admin");
            health.put("database", "connected");
        } catch (Exception e) {
            health.put("database", "disconnected");
        }
        
        return Result.success(health);
    }
}
