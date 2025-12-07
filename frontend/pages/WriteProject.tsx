
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { PageRoute } from '../types';
import { uploadFile } from '../api/file';
import { ChevronLeft, Save, Plus, X, Layout, Type, Link as LinkIcon } from 'lucide-react';

export const WriteProject: React.FC = () => {
  const { user, addProject } = useAppStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Security Check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate(PageRoute.WORKS);
    }
  }, [user, navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !techStack.includes(tagInput.trim())) {
      setTechStack([...techStack, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      window.toast?.error('请输入作品名称');
      return;
    }
    if (!description.trim()) {
      window.toast?.error('请输入作品描述');
      return;
    }
    
    let imageUrl = image;
    if (selectedFile) {
      try {
        const res = await uploadFile(selectedFile);
        // 如果返回的是相对路径，拼接完整的API地址
        if (res.url.startsWith('/')) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
            imageUrl = apiBase + res.url;
        } else {
            imageUrl = res.url;
        }
      } catch (error) {
        console.error('上传封面失败:', error);
        window.toast?.error('上传封面失败，请重试');
        return;
      }
    }

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      link: link || '#',
      image: imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
      techStack: techStack.length > 0 ? techStack : ['General']
    };

    try {
      await addProject(newProject);
      window.toast?.success('作品发布成功！');
      navigate(PageRoute.WORKS);
    } catch (error) {
      console.error('发布作品失败:', error);
      window.toast?.error('发布作品失败，请重试');
    }
  };

  return (
    <div className="pt-8 pb-20 px-4 min-h-screen max-w-4xl mx-auto animate-fadeUp">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(PageRoute.WORKS)}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          <ChevronLeft size={20} />
          <span>返回列表</span>
        </button>
        <button 
          onClick={handlePublish}
          className="bg-[#39ff14] hover:bg-[#32d712] text-black font-bold px-8 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer z-50"
        >
          <Save size={18} />
          发布作品
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
             <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Type size={16} />
                <span className="text-xs uppercase tracking-wider">Project Name</span>
             </div>
             <input 
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="输入作品名称..."
               className="w-full bg-transparent text-2xl font-bold text-white placeholder-gray-700 border-none outline-none focus:ring-0 px-0"
             />
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="描述你的作品..."
               className="w-full h-40 bg-transparent text-slate-300 placeholder-gray-700 resize-none focus:outline-none"
             />
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
             <div className="flex items-center gap-2 text-slate-500 mb-4">
                <LinkIcon size={16} />
                <span className="text-xs uppercase tracking-wider">Project Link</span>
             </div>
             <input 
               type="text"
               value={link}
               onChange={(e) => setLink(e.target.value)}
               placeholder="https://example.com"
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
             />
          </div>
        </div>

        {/* Right: Meta */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Layout size={16} />
                    <span className="text-sm font-medium">作品封面</span>
                 </div>
              </div>
              <div 
                onClick={handleImageClick}
                className="aspect-video bg-gray-900 cursor-pointer group relative overflow-hidden"
              >
                 {image ? (
                   <>
                     <img src={image} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">更换图片</span>
                     </div>
                   </>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 group-hover:text-indigo-400 transition-colors">
                      <Plus size={32} className="mb-2"/>
                      <span className="text-sm">点击上传</span>
                   </div>
                 )}
              </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
             <div className="text-slate-400 text-sm mb-4">技术栈 (Tag)</div>
             <div className="flex flex-wrap gap-2 mb-4">
                {techStack.map(tag => (
                  <span key={tag} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                    {tag}
                    <button onClick={() => setTechStack(techStack.filter(t => t !== tag))}><X size={12}/></button>
                  </span>
                ))}
             </div>
             <input 
               type="text" 
               value={tagInput}
               onChange={(e) => setTagInput(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="输入技术栈回车..."
               className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
             />
          </div>
        </div>
      </div>
    </div>
  );
};
