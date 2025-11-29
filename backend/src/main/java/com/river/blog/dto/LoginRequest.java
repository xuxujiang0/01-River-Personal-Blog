package com.river.blog.dto;

import lombok.Data;

/**
 * 登录请求DTO
 * 
 * @author River
 */
@Data
public class LoginRequest {
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码
     */
    private String password;
    
    /**
     * 昵称（注册时用）
     */
    private String nickname;
    
    /**
     * 头像（注册时用）
     */
    private String avatar;
    
    /**
     * 邮箱（注册时用，可选）
     */
    private String email;
}
