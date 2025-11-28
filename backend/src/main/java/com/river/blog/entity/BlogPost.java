package com.river.blog.entity;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 博客文章实体
 * 
 * @author River
 */
@Data
public class BlogPost implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 文章ID
     */
    private Long id;
    
    /**
     * 作者ID
     */
    private Long userId;
    
    /**
     * 文章标题
     */
    private String title;
    
    /**
     * 文章摘要
     */
    private String excerpt;
    
    /**
     * 文章内容
     */
    private String content;
    
    /**
     * 封面图
     */
    private String cover;
    
    /**
     * 浏览量
     */
    private Integer views;
    
    /**
     * 评论数
     */
    private Integer comments;
    
    /**
     * 状态: published/hidden/draft
     */
    private String status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 标签列表（非数据库字段）
     */
    private List<String> tags;
    
    /**
     * 内容图片列表（非数据库字段）
     */
    private List<String> contentImages;
}
