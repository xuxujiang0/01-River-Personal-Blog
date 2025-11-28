package com.river.blog.service.impl;

import com.river.blog.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    
    @Override
    public Map<String, String> uploadFile(MultipartFile file, Long userId) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        try {
            // 确保上传目录存在
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
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
            
            // 构建访问URL
            String fileUrl = urlPrefix + filename;
            
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
