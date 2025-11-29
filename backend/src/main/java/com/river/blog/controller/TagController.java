package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.mapper.BlogTagMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 标签Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/tags")
public class TagController {
    
    private final BlogTagMapper blogTagMapper;
    
    public TagController(BlogTagMapper blogTagMapper) {
        this.blogTagMapper = blogTagMapper;
    }
    
    /**
     * 获取所有标签（按创建时间降序）
     */
    @GetMapping
    public Result<List<Map<String, Object>>> getAllTags() {
        try {
            List<Map<String, Object>> tags = blogTagMapper.selectAllTags();
            return Result.success(tags);
        } catch (Exception e) {
            return Result.error("获取标签列表失败: " + e.getMessage());
        }
    }
}
