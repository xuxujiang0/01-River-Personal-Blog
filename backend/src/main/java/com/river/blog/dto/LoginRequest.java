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
     * 登录方式: admin/wechat/github
     */
    private String provider;
}
