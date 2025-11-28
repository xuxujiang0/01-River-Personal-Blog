package com.river.blog.service;

import com.river.blog.entity.BlogPost;

import java.util.List;
import java.util.Map;

/**
 * 博客Service
 * 
 * @author River
 */
public interface BlogPostService {
    
    /**
     * 获取博客列表
     */
    Map<String, Object> getBlogList(String status, Integer page, Integer size);
    
    /**
     * 根据ID获取博客
     */
    BlogPost getBlogById(Long id);
    
    /**
     * 创建博客
     */
    BlogPost createBlog(BlogPost blogPost, List<String> tags);
    
    /**
     * 更新博客
     */
    BlogPost updateBlog(Long id, BlogPost blogPost, List<String> tags);
    
    /**
     * 删除博客
     */
    void deleteBlog(Long id);
    
    /**
     * 切换博客状态
     */
    void toggleBlogStatus(Long id);
    
    /**
     * 增加浏览量
     */
    void incrementViews(Long id);
}
