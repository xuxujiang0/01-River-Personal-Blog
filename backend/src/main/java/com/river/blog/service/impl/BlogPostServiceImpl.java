package com.river.blog.service.impl;

import com.river.blog.entity.BlogPost;
import com.river.blog.mapper.BlogPostMapper;
import com.river.blog.mapper.BlogTagMapper;
import com.river.blog.service.BlogPostService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 博客Service实现
 * 
 * @author River
 */
@Service
public class BlogPostServiceImpl implements BlogPostService {
    
    private final BlogPostMapper blogPostMapper;
    private final BlogTagMapper blogTagMapper;
    
    public BlogPostServiceImpl(BlogPostMapper blogPostMapper, BlogTagMapper blogTagMapper) {
        this.blogPostMapper = blogPostMapper;
        this.blogTagMapper = blogTagMapper;
    }
    
    @Override
    public Map<String, Object> getBlogList(String status, Integer page, Integer size) {
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 查询列表
        List<BlogPost> list = blogPostMapper.selectList(status, offset, size);
        
        // 查询每篇博客的标签
        for (BlogPost post : list) {
            List<String> tags = blogTagMapper.selectTagsByPostId(post.getId());
            post.setTags(tags);
        }
        
        // 查询总数
        int total = blogPostMapper.countByStatus(status);
        
        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    @Override
    public BlogPost getBlogById(Long id) {
        BlogPost blogPost = blogPostMapper.selectById(id);
        if (blogPost != null) {
            // 查询标签
            List<String> tags = blogTagMapper.selectTagsByPostId(id);
            blogPost.setTags(tags);
        }
        return blogPost;
    }
    
    @Override
    @Transactional
    public BlogPost createBlog(BlogPost blogPost, List<String> tags) {
        // 插入博客
        blogPostMapper.insert(blogPost);
        
        // 保存标签
        saveTags(blogPost.getId(), tags);
        
        return getBlogById(blogPost.getId());
    }
    
    @Override
    @Transactional
    public BlogPost updateBlog(Long id, BlogPost blogPost, List<String> tags) {
        blogPost.setId(id);
        blogPostMapper.update(blogPost);
        
        // 删除旧标签
        blogTagMapper.deletePostTags(id);
        
        // 保存新标签
        saveTags(id, tags);
        
        return getBlogById(id);
    }
    
    @Override
    @Transactional
    public void deleteBlog(Long id) {
        // 删除标签关联
        blogTagMapper.deletePostTags(id);
        // 删除博客
        blogPostMapper.deleteById(id);
    }
    
    @Override
    public void toggleBlogStatus(Long id) {
        BlogPost blogPost = blogPostMapper.selectById(id);
        if (blogPost != null) {
            String newStatus = "published".equals(blogPost.getStatus()) ? "hidden" : "published";
            blogPostMapper.updateStatus(id, newStatus);
        }
    }
    
    @Override
    public void incrementViews(Long id) {
        blogPostMapper.incrementViews(id);
    }
    
    /**
     * 保存标签
     */
    private void saveTags(Long postId, List<String> tags) {
        if (tags != null && !tags.isEmpty()) {
            for (String tagName : tags) {
                // 查询标签是否存在
                Long tagId = blogTagMapper.selectIdByName(tagName);
                if (tagId == null) {
                    // 不存在则创建
                    blogTagMapper.insertTag(tagName);
                    tagId = blogTagMapper.selectIdByName(tagName);
                }
                // 建立关联
                blogTagMapper.insertPostTag(postId, tagId);
            }
        }
    }
}
