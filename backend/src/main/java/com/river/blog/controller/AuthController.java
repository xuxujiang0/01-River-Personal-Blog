package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.dto.LoginRequest;
import com.river.blog.dto.LoginResponse;
import com.river.blog.service.UserService;
import org.springframework.web.bind.annotation.*;

/**
 * 认证Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 管理员快速登录
     */
    @PostMapping("/admin")
    public Result<LoginResponse> adminLogin() {
        try {
            LoginRequest request = new LoginRequest();
            request.setUsername("admin");
            request.setPassword("admin123");
            LoginResponse response = userService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
