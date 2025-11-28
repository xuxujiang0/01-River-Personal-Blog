package com.river.blog.service;

import com.river.blog.dto.LoginRequest;
import com.river.blog.dto.LoginResponse;
import com.river.blog.entity.User;

/**
 * 用户Service
 * 
 * @author River
 */
public interface UserService {
    
    /**
     * 用户登录
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * 根据ID查询用户
     */
    User getUserById(Long id);
    
    /**
     * 根据用户名查询用户
     */
    User getUserByUsername(String username);
    
    /**
     * 创建用户
     */
    User createUser(User user);
    
    /**
     * 更新用户
     */
    User updateUser(User user);
}
