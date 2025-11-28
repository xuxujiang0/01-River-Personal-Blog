package com.river.blog.mapper;

import com.river.blog.entity.BlogPost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 博客文章Mapper
 * 
 * @author River
 */
@Mapper
public interface BlogPostMapper {
    
    /**
     * 根据ID查询博客
     */
    BlogPost selectById(@Param("id") Long id);
    
    /**
     * 查询博客列表
     */
    List<BlogPost> selectList(@Param("status") String status, 
                               @Param("offset") Integer offset, 
                               @Param("limit") Integer limit);
    
    /**
     * 查询总数
     */
    int countByStatus(@Param("status") String status);
    
    /**
     * 插入博客
     */
    int insert(BlogPost blogPost);
    
    /**
     * 更新博客
     */
    int update(BlogPost blogPost);
    
    /**
     * 删除博客
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 更新浏览量
     */
    int incrementViews(@Param("id") Long id);
    
    /**
     * 更新状态
     */
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
