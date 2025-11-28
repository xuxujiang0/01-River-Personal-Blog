package com.river.blog.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * 文件Service
 * 
 * @author River
 */
public interface FileService {
    
    /**
     * 上传文件
     */
    Map<String, String> uploadFile(MultipartFile file, Long userId);
}
