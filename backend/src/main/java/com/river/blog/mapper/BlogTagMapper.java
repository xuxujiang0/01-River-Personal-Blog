package com.river.blog.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 博客标签Mapper
 * 
 * @author River
 */
@Mapper
public interface BlogTagMapper {
    
    /**
     * 根据名称查询标签ID
     */
    Long selectIdByName(@Param("name") String name);
    
    /**
     * 插入标签
     */
    int insertTag(@Param("name") String name);
    
    /**
     * 查询文章的所有标签
     */
    List<String> selectTagsByPostId(@Param("postId") Long postId);
    
    /**
     * 插入文章-标签关联
     */
    int insertPostTag(@Param("postId") Long postId, @Param("tagId") Long tagId);
    
    /**
     * 删除文章的所有标签关联
     */
    int deletePostTags(@Param("postId") Long postId);
}
