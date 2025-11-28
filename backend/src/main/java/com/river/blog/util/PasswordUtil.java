package com.river.blog.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码工具类 - 用于生成和测试BCrypt密码
 */
public class PasswordUtil {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 生成密码哈希
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("========================================");
        System.out.println("密码: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("========================================");
        
        // 测试已知的哈希值
        String[] testHashes = {
            "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
            "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH"
        };
        
        System.out.println("\n测试已知哈希值:");
        for (int i = 0; i < testHashes.length; i++) {
            boolean matches = encoder.matches(password, testHashes[i]);
            System.out.println("Hash " + (i + 1) + ": " + (matches ? "✓ 匹配" : "✗ 不匹配"));
            System.out.println("  " + testHashes[i]);
        }
        
        System.out.println("\n========================================");
        System.out.println("请将以下SQL复制到MySQL中执行:");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
        System.out.println("========================================");
    }
}
