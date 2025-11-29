package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.mapper.BlogTagMapper;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 调试Controller - 用于测试标签功能
 * 
 * @author River
 */
@RestController
@RequestMapping("/debug")
public class DebugController {
    
    private final BlogTagMapper blogTagMapper;
    
    public DebugController(BlogTagMapper blogTagMapper) {
        this.blogTagMapper = blogTagMapper;
    }
    
    /**
     * 测试标签插入
     * 访问: GET /api/debug/test-tag-insert?name=测试标签
     */
    @GetMapping("/test-tag-insert")
    public Result<Map<String, Object>> testTagInsert(@RequestParam String name) {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // 检查标签是否已存在
            Long existingTagId = blogTagMapper.selectIdByName(name);
            result.put("existingTagId", existingTagId);
            
            if (existingTagId == null) {
                // 插入新标签
                int rowsAffected = blogTagMapper.insertTag(name);
                result.put("rowsAffected", rowsAffected);
                
                // 再次查询标签ID
                Long newTagId = blogTagMapper.selectIdByName(name);
                result.put("newTagId", newTagId);
                
                result.put("message", "标签插入成功");
            } else {
                result.put("message", "标签已存在");
            }
            
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("标签插入失败: " + e.getMessage());
        }
    }
    
    /**
     * 测试获取所有标签
     * 访问: GET /api/debug/test-get-tags
     */
    @GetMapping("/test-get-tags")
    public Result<?> testGetTags() {
        try {
            // 这里可以添加获取所有标签的逻辑
            return Result.success("标签功能测试端点");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("测试失败: " + e.getMessage());
        }
    }
}