package com.river.blog.controller;

import com.river.blog.common.Result;
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
    
    public UtilController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
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
}
