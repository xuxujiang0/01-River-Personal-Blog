package com.river.blog.entity;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目作品实体
 * 
 * @author River
 */
@Data
public class Project implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 项目ID
     */
    private Long id;
    
    /**
     * 创建者ID
     */
    private Long userId;
    
    /**
     * 项目标题
     */
    private String title;
    
    /**
     * 项目描述
     */
    private String description;
    
    /**
     * 项目图片
     */
    private String image;
    
    /**
     * 项目链接
     */
    private String link;
    
    /**
     * 排序
     */
    private Integer sortOrder;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 技术栈列表（非数据库字段）
     */
    private List<String> techStack;
}
