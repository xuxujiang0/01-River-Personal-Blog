package com.river.blog.mapper;

import com.river.blog.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 项目Mapper
 * 
 * @author River
 */
@Mapper
public interface ProjectMapper {
    
    /**
     * 根据ID查询项目
     */
    Project selectById(@Param("id") Long id);
    
    /**
     * 查询所有项目（按排序）
     */
    List<Project> selectAll();
    
    /**
     * 插入项目
     */
    int insert(Project project);
    
    /**
     * 更新项目
     */
    int update(Project project);
    
    /**
     * 删除项目
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 查询项目的技术栈
     */
    List<String> selectTechStackByProjectId(@Param("projectId") Long projectId);
    
    /**
     * 插入项目技术栈
     */
    int insertTechStack(@Param("projectId") Long projectId, @Param("techName") String techName);
    
    /**
     * 删除项目技术栈
     */
    int deleteTechStack(@Param("projectId") Long projectId);
}
