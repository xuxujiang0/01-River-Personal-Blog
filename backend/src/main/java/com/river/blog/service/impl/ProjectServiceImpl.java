package com.river.blog.service.impl;

import com.river.blog.entity.Project;
import com.river.blog.mapper.ProjectMapper;
import com.river.blog.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 项目Service实现
 * 
 * @author River
 */
@Service
public class ProjectServiceImpl implements ProjectService {
    
    private final ProjectMapper projectMapper;
    
    public ProjectServiceImpl(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }
    
    @Override
    public List<Project> getAllProjects() {
        List<Project> projects = projectMapper.selectAll();
        // 查询每个项目的技术栈
        for (Project project : projects) {
            List<String> techStack = projectMapper.selectTechStackByProjectId(project.getId());
            project.setTechStack(techStack);
        }
        return projects;
    }
    
    @Override
    public Project getProjectById(Long id) {
        Project project = projectMapper.selectById(id);
        if (project != null) {
            List<String> techStack = projectMapper.selectTechStackByProjectId(id);
            project.setTechStack(techStack);
        }
        return project;
    }
    
    @Override
    @Transactional
    public Project createProject(Project project, List<String> techStack) {
        // 插入项目
        projectMapper.insert(project);
        
        // 保存技术栈
        saveTechStack(project.getId(), techStack);
        
        return getProjectById(project.getId());
    }
    
    @Override
    @Transactional
    public Project updateProject(Long id, Project project, List<String> techStack) {
        project.setId(id);
        projectMapper.update(project);
        
        // 删除旧技术栈
        projectMapper.deleteTechStack(id);
        
        // 保存新技术栈
        saveTechStack(id, techStack);
        
        return getProjectById(id);
    }
    
    @Override
    @Transactional
    public void deleteProject(Long id) {
        // 删除技术栈
        projectMapper.deleteTechStack(id);
        // 删除项目
        projectMapper.deleteById(id);
    }
    
    /**
     * 保存技术栈
     */
    private void saveTechStack(Long projectId, List<String> techStack) {
        if (techStack != null && !techStack.isEmpty()) {
            for (String tech : techStack) {
                projectMapper.insertTechStack(projectId, tech);
            }
        }
    }
}
