package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.entity.BlogComment;
import com.river.blog.mapper.BlogCommentMapper;
import com.river.blog.mapper.BlogPostMapper;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 博客评论Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/blogs/{postId}/comments")
public class BlogCommentController {
    
    private final BlogCommentMapper blogCommentMapper;
    private final BlogPostMapper blogPostMapper;
    
    public BlogCommentController(BlogCommentMapper blogCommentMapper, BlogPostMapper blogPostMapper) {
        this.blogCommentMapper = blogCommentMapper;
        this.blogPostMapper = blogPostMapper;
    }
    
    /**
     * 获取博客评论列表
     */
    @GetMapping
    public Result<List<BlogComment>> getComments(@PathVariable Long postId) {
        try {
            List<BlogComment> comments = blogCommentMapper.selectByPostId(postId);
            return Result.success(comments);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 发表评论（需要认证）
     */
    @PostMapping
    public Result<BlogComment> createComment(@PathVariable Long postId,
                                               @RequestBody Map<String, Object> params,
                                               Authentication authentication) {
        try {
            // 获取用户ID
            Long userId = null;
            if (authentication != null && authentication.getPrincipal() != null) {
                try {
                    userId = Long.valueOf(authentication.getPrincipal().toString());
                } catch (Exception e) {
                    userId = ((Number) authentication.getPrincipal()).longValue();
                }
            }
            
            if (userId == null) {
                return Result.error("用户未登录");
            }
            
            // 创建评论
            BlogComment comment = new BlogComment();
            comment.setPostId(postId);
            comment.setUserId(userId);
            comment.setContent((String) params.get("content"));
            
            // 父评论ID（可选）
            if (params.containsKey("parentId")) {
                comment.setParentId(Long.valueOf(params.get("parentId").toString()));
            }
            
            blogCommentMapper.insert(comment);
            
            // 更新博客评论数
            int commentCount = blogCommentMapper.countByPostId(postId);
            blogPostMapper.updateCommentCount(postId, commentCount);
            
            // 查询完整的评论信息（包含用户信息）
            BlogComment fullComment = blogCommentMapper.selectById(comment.getId());
            
            return Result.success(fullComment);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("发表评论失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除评论（需要认证）
     */
    @DeleteMapping("/{commentId}")
    public Result<Void> deleteComment(@PathVariable Long postId,
                                       @PathVariable Long commentId,
                                       Authentication authentication) {
        try {
            // 获取用户ID
            Long userId = null;
            if (authentication != null && authentication.getPrincipal() != null) {
                try {
                    userId = Long.valueOf(authentication.getPrincipal().toString());
                } catch (Exception e) {
                    userId = ((Number) authentication.getPrincipal()).longValue();
                }
            }
            
            if (userId == null) {
                return Result.error("用户未登录");
            }
            
            // 查询评论
            BlogComment comment = blogCommentMapper.selectById(commentId);
            if (comment == null) {
                return Result.error("评论不存在");
            }
            
            // 检查权限（只能删除自己的评论）
            if (!comment.getUserId().equals(userId)) {
                return Result.error("无权限删除此评论");
            }
            
            // 删除评论
            blogCommentMapper.deleteById(commentId);
            
            // 更新博客评论数
            int commentCount = blogCommentMapper.countByPostId(postId);
            blogPostMapper.updateCommentCount(postId, commentCount);
            
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
