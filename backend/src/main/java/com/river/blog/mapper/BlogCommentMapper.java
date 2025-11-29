package com.river.blog.mapper;

import com.river.blog.entity.BlogComment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 博客评论Mapper
 * 
 * @author River
 */
@Mapper
public interface BlogCommentMapper {
    
    /**
     * 根据ID查询评论
     */
    BlogComment selectById(@Param("id") Long id);
    
    /**
     * 根据文章ID查询评论列表
     */
    List<BlogComment> selectByPostId(@Param("postId") Long postId);
    
    /**
     * 插入评论
     */
    int insert(BlogComment comment);
    
    /**
     * 删除评论
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 根据文章ID删除所有评论
     */
    int deleteByPostId(@Param("postId") Long postId);
    
    /**
     * 统计文章评论数
     */
    int countByPostId(@Param("postId") Long postId);
}
