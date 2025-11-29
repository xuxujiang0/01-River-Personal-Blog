package com.river.blog.service.impl;

import com.river.blog.entity.BlogPost;
import com.river.blog.mapper.BlogPostMapper;
import com.river.blog.mapper.BlogTagMapper;
import com.river.blog.mapper.BlogCommentMapper;
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
    private final BlogCommentMapper blogCommentMapper;
    
    public BlogPostServiceImpl(BlogPostMapper blogPostMapper, BlogTagMapper blogTagMapper, BlogCommentMapper blogCommentMapper) {
        this.blogPostMapper = blogPostMapper;
        this.blogTagMapper = blogTagMapper;
        this.blogCommentMapper = blogCommentMapper;
    }
    
    @Override
    public Map<String, Object> getBlogList(String status, Integer page, Integer size) {
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 查询列表
        List<BlogPost> list = blogPostMapper.selectList(status, offset, size);
        
        // 查询每篇博客的标签和图片
        for (BlogPost post : list) {
            List<String> tags = blogTagMapper.selectTagsByPostId(post.getId());
            post.setTags(tags);
            
            List<String> contentImages = blogPostMapper.selectContentImages(post.getId());
            post.setContentImages(contentImages);
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
            
            // 查询内容图片
            List<String> contentImages = blogPostMapper.selectContentImages(id);
            blogPost.setContentImages(contentImages);
            
            // 更新评论数
            int commentCount = blogCommentMapper.countByPostId(id);
            blogPost.setComments(commentCount);
        }
        return blogPost;
    }
    
    @Override
    @Transactional
    public BlogPost createBlog(BlogPost blogPost, List<String> tags) {
        // 插入博客
        blogPostMapper.insert(blogPost);
        
        // 保存标签
        if (tags != null && !tags.isEmpty()) {
            saveTags(blogPost.getId(), tags);
        }
        
        // 保存内容图片
        if (blogPost.getContentImages() != null && !blogPost.getContentImages().isEmpty()) {
            saveContentImages(blogPost.getId(), blogPost.getContentImages());
        }
        
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
        if (tags != null && !tags.isEmpty()) {
            saveTags(id, tags);
        }
        
        // 删除旧图片
        deleteContentImages(id);
        
        // 保存新图片
        if (blogPost.getContentImages() != null && !blogPost.getContentImages().isEmpty()) {
            saveContentImages(id, blogPost.getContentImages());
        }
        
        return getBlogById(id);
    }
    
    @Override
    @Transactional
    public void deleteBlog(Long id) {
        // 删除评论
        blogCommentMapper.deleteByPostId(id);
        // 删除标签关联
        blogTagMapper.deletePostTags(id);
        // 删除内容图片
        blogPostMapper.deleteContentImages(id);
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
    
    /**
     * 保存内容图片
     */
    private void saveContentImages(Long postId, List<String> images) {
        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                blogPostMapper.insertContentImage(postId, images.get(i), i);
            }
        }
    }
    
    /**
     * 删除内容图片
     */
    private void deleteContentImages(Long postId) {
        blogPostMapper.deleteContentImages(postId);
    }
}
