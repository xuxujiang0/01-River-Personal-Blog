package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.entity.BlogPost;
import com.river.blog.service.BlogPostService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 博客Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/blogs")
public class BlogPostController {
    
    private final BlogPostService blogPostService;
    
    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }
    
    /**
     * 获取博客列表
     */
    @GetMapping
    public Result<Map<String, Object>> getBlogList(
            @RequestParam(required = false, defaultValue = "published") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        try {
            Map<String, Object> result = blogPostService.getBlogList(status, page, size);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 获取博客详情
     */
    @GetMapping("/{id}")
    public Result<BlogPost> getBlogDetail(@PathVariable Long id) {
        try {
            // 增加浏览量
            blogPostService.incrementViews(id);
            
            BlogPost blogPost = blogPostService.getBlogById(id);
            if (blogPost == null) {
                return Result.notFound("博客不存在");
            }
            return Result.success(blogPost);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 创建博客（需要认证）
     */
    @PostMapping
    public Result<BlogPost> createBlog(@RequestBody Map<String, Object> params, Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            
            BlogPost blogPost = new BlogPost();
            blogPost.setUserId(userId);
            blogPost.setTitle((String) params.get("title"));
            blogPost.setExcerpt((String) params.get("excerpt"));
            blogPost.setContent((String) params.get("content"));
            blogPost.setCover((String) params.get("cover"));
            blogPost.setStatus((String) params.get("status"));
            
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) params.get("tags");
            
            BlogPost result = blogPostService.createBlog(blogPost, tags);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 更新博客（需要认证）
     */
    @PutMapping("/{id}")
    public Result<BlogPost> updateBlog(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        try {
            BlogPost blogPost = new BlogPost();
            blogPost.setTitle((String) params.get("title"));
            blogPost.setExcerpt((String) params.get("excerpt"));
            blogPost.setContent((String) params.get("content"));
            blogPost.setCover((String) params.get("cover"));
            blogPost.setStatus((String) params.get("status"));
            
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) params.get("tags");
            
            BlogPost result = blogPostService.updateBlog(id, blogPost, tags);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 删除博客（需要认证）
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteBlog(@PathVariable Long id) {
        try {
            blogPostService.deleteBlog(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 切换博客状态（需要认证）
     */
    @PutMapping("/{id}/status")
    public Result<Void> toggleBlogStatus(@PathVariable Long id) {
        try {
            blogPostService.toggleBlogStatus(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
