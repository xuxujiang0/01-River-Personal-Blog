import React, { useState, useEffect, useRef } from 'react';
import { Eye, MessageSquare, PenTool, Calendar, ArrowLeft, Send, Loader2, Image as ImageIcon, Trash2, Copy, EyeOff } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { PageRoute, BlogPost } from '../types';
import { getBlogDetail } from '../api/blog';
import * as commentApi from '../api/comment';
import { getFileUrl } from '../api/file';
import { getAvatarUrl } from '../utils/avatar';

const MOCK_COMMENTS_DATA: any[] = [];

export const Blog: React.FC = () => {
  const { user, openAuthModal, blogs, deleteBlog, toggleBlogStatus, loadBlogs: reloadBlogs } = useAppStore(); // Load blogs from global store
  const navigate = useNavigate();
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState(MOCK_COMMENTS_DATA);

  // Filter blogs based on user role
  const filteredBlogs = blogs.filter(b => user?.role === 'admin' || b.status === 'published');

  // Infinite Scroll States
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length + 10;

  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activePostId) return; 

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, hasMore, activePostId, filteredBlogs.length]);

  // 获取博客详情
  useEffect(() => {
    if (activePostId) {
      const fetchBlogDetail = async () => {
        try {
          const blogDetail = await getBlogDetail(activePostId);
          // 映射后端数据到前端格式
          const mappedBlog = {
            ...blogDetail,
            date: blogDetail.createdAt ? blogDetail.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            id: String(blogDetail.id),
          };
          setActivePost(mappedBlog);
          
          // 加载评论列表
          const comments = await commentApi.getComments(activePostId);
          const mappedComments = comments.map(c => ({
            id: c.id,
            user: c.nickname || c.username,
            avatar: c.avatar,
            content: c.content,
            date: c.createdAt.split('T')[0],
          }));
          setPostComments(mappedComments);
        } catch (error) {
          console.error('获取博客详情失败:', error);
        }
      };
      
      fetchBlogDetail();
    } else {
      setActivePost(null);
      setPostComments([]);
    }
  }, [activePostId]);

  const loadMoreBlogs = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 1000);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user || !activePostId) return;
    
    try {
      const newComment = await commentApi.createComment(activePostId, {
        content: commentText,
      });
      
      // 添加到评论列表
      const mappedComment = {
        id: newComment.id,
        user: newComment.nickname || newComment.username,
        avatar: newComment.avatar,
        content: newComment.content,
        date: newComment.createdAt.split('T')[0],
      };
      setPostComments([mappedComment, ...postComments]);
      setCommentText('');
      
      // 更新博客评论数
      if (activePost) {
        setActivePost({ ...activePost, comments: activePost.comments + 1 });
      }
    } catch (error) {
      console.error('发表评论失败:', error);
      window.toast?.error('发表评论失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await window.toast?.confirm('确定要删除这篇博客吗？此操作不可恢复。', {
      title: '删除博客',
      confirmText: '确定删除',
      cancelText: '取消'
    });
    
    if (confirmed) {
      deleteBlog(id);
      if (activePostId === id) setActivePostId(null);
      window.toast?.success('博客删除成功！');
    }
  };

  // 返回列表时刷新数据
  const handleBackToList = () => {
    setActivePostId(null);
    reloadBlogs();
  };

  const handleClone = async (blog: BlogPost) => {
    const confirmed = await window.toast?.confirm(`确定要克隆 "${blog.title}" 并进行编辑吗？`, {
      title: '克隆博客',
      confirmText: '确定',
      cancelText: '取消'
    });
    
    if (confirmed) {
      navigate(PageRoute.WRITE, { state: { cloneData: blog } });
    }
  };

  // --- Detail View ---
  if (activePost) {
    return (
      <div className="pt-8 pb-12 px-4 max-w-4xl mx-auto min-h-screen animate-fadeIn">
        <button 
          onClick={handleBackToList}
          className="mb-6 flex items-center text-slate-400 hover:text-indigo-400 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 返回列表
        </button>

        {/* Article Header */}
        <div className="mb-8 border-b border-gray-800 pb-6">
           <div className="flex gap-2 mb-3">
              {activePost.tags.map(tag => (
                <span key={tag} className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">{tag}</span>
              ))}
              {activePost.status === 'hidden' && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">已隐藏</span>
              )}
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{activePost.title}</h1>
           <div className="flex items-center justify-between text-slate-500 text-sm">
              <div className="flex items-center gap-6">
                 <span className="flex items-center gap-2"><Calendar size={16}/> {activePost.date}</span>
                 <span className="flex items-center gap-2"><Eye size={16}/> {activePost.views} 阅读</span>
                 <span className="flex items-center gap-2"><MessageSquare size={16}/> {activePost.comments} 评论</span>
              </div>
              <span className="text-indigo-400">By Admin</span>
           </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12 text-slate-300">
           {activePost.contentImages && activePost.contentImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8 not-prose">
                 {activePost.contentImages.map((img, i) => (
                    <img key={i} src={getFileUrl(img)} alt="content" className="rounded-lg border border-gray-800 w-full h-auto" />
                 ))}
              </div>
           )}

           <div dangerouslySetInnerHTML={{ __html: activePost.content || '' }} />
        </div>

        {/* Comments Section */}
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <MessageSquare className="text-indigo-500"/> 
             评论区 <span className="text-slate-500 text-sm font-normal">({postComments.length})</span>
           </h3>

           <div className="mb-8">
             {user ? (
               <div className="flex gap-4">
                 <img src={getAvatarUrl(user)} alt="me" className="w-10 h-10 rounded bg-gray-800 flex-shrink-0" />
                 <div className="flex-1">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={`以 ${user.role === 'admin' ? '管理员' : '用户'} 身份发表评论...`}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
                    />
                    <div className="mt-2 flex justify-end">
                       <button 
                         onClick={handleCommentSubmit}
                         disabled={!commentText.trim()}
                         className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
                       >
                         <Send size={16} /> 发布
                       </button>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-8 text-center">
                  <p className="text-slate-400 mb-4">登录后参与讨论，支持 Markdown 语法</p>
                  <button 
                    onClick={openAuthModal}
                    className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-600 hover:text-white px-6 py-2 rounded-full transition-all"
                  >
                    登录 / 注册
                  </button>
               </div>
             )}
           </div>

           <div className="space-y-6">
              {postComments.map(comment => (
                <div key={comment.id} className="flex gap-4 animate-fadeIn">
                   <img src={getAvatarUrl({ avatar: comment.avatar, role: null })} alt={comment.user} className="w-10 h-10 rounded bg-gray-800" />
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className="text-white font-medium text-sm">{comment.user}</h4>
                         <span className="text-slate-600 text-xs">{comment.date}</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="pt-8 pb-12 px-4 max-w-6xl mx-auto w-full min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-4xl font-bold text-white mb-2">技术博客</h1>
           <p className="text-slate-400">分享代码，记录生活，思考未来。</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => navigate(PageRoute.WRITE)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/25"
          >
            <PenTool size={18} />
            <span>写博客</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {visibleBlogs.map((blog) => (
          <div 
            key={blog.id} 
            onClick={() => setActivePostId(blog.id)}
            className={`group relative bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 ${
              blog.status === 'hidden' ? 'border-red-900 opacity-75' : 'border-slate-700 hover:border-indigo-500/50'
            }`}
          >
            {/* Image Container */}
            <div className="w-full aspect-video overflow-hidden relative bg-slate-900">
              <img 
                src={getFileUrl(blog.cover)} 
                alt={blog.title} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${blog.status === 'hidden' ? 'grayscale' : ''}`}
              />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                 {blog.tags.map(tag => (
                   <span key={tag} className="text-xs bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md border border-white/10">{tag}</span>
                 ))}
                 {blog.status === 'hidden' && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md font-bold">已禁用</span>
                 )}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1 relative z-20 bg-slate-800">
              <div className="flex items-center text-xs text-slate-400 mb-3 space-x-4">
                 <span className="flex items-center space-x-1"><Calendar size={12}/> <span>{blog.date}</span></span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">{blog.title}</h2>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{blog.excerpt}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-700 text-slate-500 text-sm">
                 <div className="flex space-x-4">
                    <span className="flex items-center space-x-1 hover:text-indigo-400 transition-colors"><Eye size={16}/> <span>{blog.views}</span></span>
                    <span className="flex items-center space-x-1 hover:text-indigo-400 transition-colors"><MessageSquare size={16}/> <span>{blog.comments}</span></span>
                    {blog.contentImages && blog.contentImages.length > 0 && (
                      <span className="flex items-center space-x-1 text-indigo-400"><ImageIcon size={16}/> <span>{blog.contentImages.length} 图</span></span>
                    )}
                 </div>
                 <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">阅读全文 &rarr;</span>
              </div>
            </div>

            {/* Admin Controls */}
            {user?.role === 'admin' && (
              <div 
                className="absolute top-2 right-2 flex gap-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-xl"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }} 
              >
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleBlogStatus(blog.id); }}
                  className={`p-1.5 rounded hover:bg-white/20 transition-colors ${blog.status === 'hidden' ? 'text-red-400' : 'text-green-400'}`}
                  title={blog.status === 'published' ? '隐藏博客' : '发布博客'}
                >
                  {blog.status === 'published' ? <Eye size={16}/> : <EyeOff size={16}/>}
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleClone(blog); }}
                  className="p-1.5 rounded text-blue-400 hover:bg-white/20 transition-colors"
                  title="克隆并编辑"
                >
                   <Copy size={16}/>
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDelete(blog.id); }}
                  className="p-1.5 rounded text-red-500 hover:bg-red-500/30 transition-colors"
                  title="删除博客"
                >
                   <Trash2 size={16}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loadMoreRef} className="w-full py-12 flex justify-center items-center">
        {isLoadingMore ? (
          <div className="flex flex-col items-center gap-2 text-indigo-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm">正在加载更多内容...</span>
          </div>
        ) : !hasMore ? (
          <div className="text-slate-600 text-sm text-center">——— 我是有底线的 ———</div>
        ) : (
          <div className="h-4"></div> 
        )}
      </div>
    </div>
  );
};