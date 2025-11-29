package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * 文件Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/files")
public class FileController {
    
    private final FileService fileService;
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }
    
    /**
     * 上传文件（允许匿名上传，用于注册时上传头像）
     */
    @PostMapping("/upload")
    public Result<String> uploadFile(@RequestParam("file") MultipartFile file, 
                                      Authentication authentication) {
        try {
            // 如果用户已登录，使用用户ID；否则使用null（注册时）
            Long userId = authentication != null ? (Long) authentication.getPrincipal() : null;
            Map<String, String> result = fileService.uploadFile(file, userId);
            // 返回文件URL
            return Result.success(result.get("url"));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 访问文件
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadPath).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
