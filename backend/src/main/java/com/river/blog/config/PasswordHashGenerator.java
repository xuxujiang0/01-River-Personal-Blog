//package com.river.blog.config;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
///**
// * 密码哈希生成器 - 启动时自动生成正确的密码哈希
// *
// * @author River
// */
//@Component
//public class PasswordHashGenerator implements CommandLineRunner {
//
//    private final PasswordEncoder passwordEncoder;
//
//    public PasswordHashGenerator(PasswordEncoder passwordEncoder) {
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        System.out.println("\n");
//        System.out.println("========================================");
//        System.out.println("🔐 生成正确的密码哈希值");
//        System.out.println("========================================");
//
//        // 生成 admin123 的哈希
//        String adminPassword = "admin123";
//        String adminHash = passwordEncoder.encode(adminPassword);
//
//        // 生成 user123 的哈希
//        String userPassword = "user123";
//        String userHash = passwordEncoder.encode(userPassword);
//
//        System.out.println("\n【管理员密码】");
//        System.out.println("明文密码: " + adminPassword);
//        System.out.println("BCrypt哈希: " + adminHash);
//        System.out.println("\n复制以下SQL到MySQL执行:");
//        System.out.println("UPDATE users SET password = '" + adminHash + "' WHERE username = 'admin';");
//
//        System.out.println("\n【普通用户密码】");
//        System.out.println("明文密码: " + userPassword);
//        System.out.println("BCrypt哈希: " + userHash);
//        System.out.println("\n复制以下SQL到MySQL执行:");
//        System.out.println("UPDATE users SET password = '" + userHash + "' WHERE username = 'testuser';");
//
//        System.out.println("\n========================================");
//        System.out.println("✅ 请复制上面的SQL语句到MySQL中执行");
//        System.out.println("========================================");
//        System.out.println("\n");
//
//        // 验证生成的哈希是否能正确匹配
//        boolean adminMatch = passwordEncoder.matches(adminPassword, adminHash);
//        boolean userMatch = passwordEncoder.matches(userPassword, userHash);
//
//        System.out.println("【验证结果】");
//        System.out.println("admin123 匹配测试: " + (adminMatch ? "✓ 成功" : "✗ 失败"));
//        System.out.println("user123 匹配测试: " + (userMatch ? "✓ 成功" : "✗ 失败"));
//        System.out.println("\n");
//    }
//}
