package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.entity.User;
import com.river.blog.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * 获取管理员信息（公开接口，用于About页面显示）
     */
    @GetMapping("/admin-profile")
    public Result<Map<String, Object>> getAdminProfile() {
        try {
            // 获取admin用户信息
            User admin = userService.getUserByUsername("admin");
            if (admin == null) {
                return Result.error("管理员账户不存在");
            }
            
            // 返回基本信息（不包含敏感信息如密码）
            Map<String, Object> profile = new java.util.HashMap<>();
            profile.put("id", admin.getId());
            profile.put("username", admin.getUsername());
            profile.put("nickname", admin.getNickname());
            profile.put("avatar", admin.getAvatar());
            profile.put("role", admin.getRole());
            
            return Result.success(profile);
        } catch (Exception e) {
            return Result.error("获取管理员信息失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新用户头像
     */
    @PutMapping("/avatar")
    public Result<Void> updateAvatar(@RequestBody Map<String, String> params, Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            String avatarUrl = params.get("avatar");
            
            if (avatarUrl == null || avatarUrl.trim().isEmpty()) {
                return Result.error("头像URL不能为空");
            }
            
            // 获取用户
            User user = userService.getUserById(userId);
            if (user == null) {
                return Result.error("用户不存在");
            }
            
            // 更新头像
            user.setAvatar(avatarUrl);
            userService.updateUser(user);
            
            return Result.success(null);
        } catch (Exception e) {
            return Result.error("头像更新失败: " + e.getMessage());
        }
    }
}
