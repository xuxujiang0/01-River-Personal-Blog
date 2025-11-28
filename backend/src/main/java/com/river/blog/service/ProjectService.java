package com.river.blog.service;

import com.river.blog.entity.Project;

import java.util.List;

/**
 * 项目Service
 * 
 * @author River
 */
public interface ProjectService {
    
    /**
     * 获取所有项目
     */
    List<Project> getAllProjects();
    
    /**
     * 根据ID获取项目
     */
    Project getProjectById(Long id);
    
    /**
     * 创建项目
     */
    Project createProject(Project project, List<String> techStack);
    
    /**
     * 更新项目
     */
    Project updateProject(Long id, Project project, List<String> techStack);
    
    /**
     * 删除项目
     */
    void deleteProject(Long id);
}
