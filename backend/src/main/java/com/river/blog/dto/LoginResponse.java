package com.river.blog.dto;

import lombok.Data;

/**
 * 登录响应DTO
 * 
 * @author River
 */
@Data
public class LoginResponse {
    
    /**
     * JWT Token
     */
    private String token;
    
    /**
     * 用户信息
     */
    private UserDTO user;
    
    @Data
    public static class UserDTO {
        private Long id;
        private String username;
        private String nickname;
        private String avatar;
        private String role;
    }
}
