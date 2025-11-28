package com.river.blog.controller;

import com.river.blog.common.Result;
import com.river.blog.entity.Project;
import com.river.blog.service.ProjectService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 项目Controller
 * 
 * @author River
 */
@RestController
@RequestMapping("/projects")
public class ProjectController {
    
    private final ProjectService projectService;
    
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    
    /**
     * 获取所有项目
     */
    @GetMapping
    public Result<List<Project>> getAllProjects() {
        try {
            List<Project> projects = projectService.getAllProjects();
            return Result.success(projects);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 获取项目详情
     */
    @GetMapping("/{id}")
    public Result<Project> getProjectDetail(@PathVariable Long id) {
        try {
            Project project = projectService.getProjectById(id);
            if (project == null) {
                return Result.notFound("项目不存在");
            }
            return Result.success(project);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 创建项目（需要认证）
     */
    @PostMapping
    public Result<Project> createProject(@RequestBody Map<String, Object> params, Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            
            Project project = new Project();
            project.setUserId(userId);
            project.setTitle((String) params.get("title"));
            project.setDescription((String) params.get("description"));
            project.setImage((String) params.get("image"));
            project.setLink((String) params.get("link"));
            project.setSortOrder(params.get("sortOrder") != null ? (Integer) params.get("sortOrder") : 0);
            
            @SuppressWarnings("unchecked")
            List<String> techStack = (List<String>) params.get("techStack");
            
            Project result = projectService.createProject(project, techStack);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 更新项目（需要认证）
     */
    @PutMapping("/{id}")
    public Result<Project> updateProject(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        try {
            Project project = new Project();
            project.setTitle((String) params.get("title"));
            project.setDescription((String) params.get("description"));
            project.setImage((String) params.get("image"));
            project.setLink((String) params.get("link"));
            
            @SuppressWarnings("unchecked")
            List<String> techStack = (List<String>) params.get("techStack");
            
            Project result = projectService.updateProject(id, project, techStack);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 删除项目（需要认证）
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
