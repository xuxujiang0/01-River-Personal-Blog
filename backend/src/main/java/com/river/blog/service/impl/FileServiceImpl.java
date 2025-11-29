package com.river.blog.service.impl;

import com.river.blog.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 文件Service实现
 * 
 * @author River
 */
@Service
public class FileServiceImpl implements FileService {
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    @Value("${file.upload.url-prefix}")
    private String urlPrefix;
    
    /**
     * 初始化方法，确保上传目录存在
     */
    @PostConstruct
    public void init() {
        try {
            // 将相对路径转换为绝对路径
            File uploadDir = new File(uploadPath);
            
            // 获取绝对路径
            String absolutePath = uploadDir.getAbsolutePath();
            
            // 创建目录（如果不存在）
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (created) {
                    System.out.println("[文件上传] 创建上传目录: " + absolutePath);
                } else {
                    System.err.println("[文件上传] 创建上传目录失败: " + absolutePath);
                }
            } else {
                System.out.println("[文件上传] 上传目录已存在: " + absolutePath);
            }
        } catch (Exception e) {
            System.err.println("[文件上传] 初始化上传目录失败: " + e.getMessage());
        }
    }
    
    @Override
    public Map<String, String> uploadFile(MultipartFile file, Long userId) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        try {
            // 确保上传目录存在（双重保障）
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
                System.out.println("[文件上传] 动态创建目录: " + uploadDir.getAbsolutePath());
            }
            
            // 获取原始文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            // 生成唯一文件名
            String filename = UUID.randomUUID().toString().replace("-", "") + extension;
            
            // 保存文件
            Path filePath = Paths.get(uploadPath, filename);
            Files.write(filePath, file.getBytes());
            
            System.out.println("[文件上传] 文件保存成功: " + filePath.toAbsolutePath());
            
            // 构建访问URL（返回相对路径，不包含/api前缀）
            String fileUrl = "/files/" + filename;
            
            // 返回结果
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", filename);
            
            return result;
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }
}
