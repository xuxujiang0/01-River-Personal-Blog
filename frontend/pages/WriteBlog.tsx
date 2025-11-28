
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { PageRoute } from '../types';
import { 
  Image as ImageIcon, X, Hash, Code, 
  ChevronLeft, Plus, Terminal, ChevronDown, Layout, Type,
  Save, Trash2
} from 'lucide-react';

const PRESET_TAGS = [
  'Frontend', 'React', 'Vue', 'TypeScript', 
  'Design', 'Cyberpunk', 'Backend', 'Life', 
  'Tutorial', 'Algorithm', 'WebGL'
];

const DRAFT_KEY = 'river_blog_draft';

export const WriteBlog: React.FC = () => {
  const { user, addBlog } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // File Input Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  
  // Blog Post State
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]); // Content Images
  const [tags, setTags] = useState<string[]>([]);
  
  // UI State
  const [tagInput, setTagInput] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [hasDraft, setHasDraft] = useState(false);

  // Security & Logout Redirect
  useEffect(() => {
    if (!user) {
      navigate(PageRoute.HOME);
      return;
    }
    if (user.role !== 'admin') {
      alert('权限不足：仅管理员可访问此页面');
      navigate(PageRoute.BLOG);
    }
  }, [user, navigate]);

  // Handle Data Loading (Clone vs Draft)
  useEffect(() => {
    // 1. Priority: Clone Data from Navigation State
    if (location.state && location.state.cloneData) {
      const data = location.state.cloneData;
      
      // Force load the data every time this effect runs with cloneData
      setTitle(data.title || '');
      setCover(data.cover || '');
      setContent(data.content ? data.content.replace(/<br\/>/g, '\n') : '');
      setTags(data.tags ? [...data.tags] : []);
      setImages(data.contentImages ? [...data.contentImages] : []);
      
      return; 
    }

    // 2. Secondary: Load Draft if exists (and we are not cloning)
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only load draft if form is empty to avoid overwriting user input
        if (!title && !content && tags.length === 0) {
            setTitle(draft.title || '');
            setCover(draft.cover || '');
            setContent(draft.content || '');
            setTags(draft.tags || []);
            setImages(draft.images || []);
            setHasDraft(true);
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [location.state, location.key]);

  // Check draft status
  useEffect(() => {
    const checkDraft = () => {
      setHasDraft(!!localStorage.getItem(DRAFT_KEY));
    };
    window.addEventListener('storage', checkDraft);
    checkDraft();
    return () => window.removeEventListener('storage', checkDraft);
  }, []);

  // --- Handlers ---

  const handleSaveDraft = () => {
    const draftData = { title, cover, content, images, tags };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    setHasDraft(true);
    alert('草稿已保存');
  };

  const handleDeleteDraft = () => {
    if (window.confirm('确定要清空当前草稿吗？此操作无法撤销。')) {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      setTitle('');
      setCover('');
      setContent('');
      setImages([]);
      setTags([]);
      alert('草稿已删除');
    }
  };

  // Trigger file selection for Cover
  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  // Handle Cover File Change
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCover(url);
    }
    if (e.target) e.target.value = '';
  };

  // Trigger file selection for Content Image
  const handleContentImageClick = () => {
    contentImageInputRef.current?.click();
  };

  // Handle Content Image File Change
  const handleContentImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
    }
    if (e.target) e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + textToInsert + text.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const confirmCodeBlock = () => {
    const codeTemplate = `\n\`\`\`${selectedLanguage}\n// 在此编写代码...\n\`\`\`\n`;
    insertTextAtCursor(codeTemplate);
    setShowCodeModal(false);
  };

  const handlePublish = () => {
    if (!title.trim()) return alert('请输入博客标题');
    if (!content.trim()) return alert('请填写博客内容');
    
    const newPost = {
      id: Date.now().toString(),
      title,
      excerpt: content.substring(0, 100) + '...',
      content: content.replace(/\n/g, '<br/>'),
      contentImages: images,
      cover: cover || `https://picsum.photos/seed/${Date.now()}/800/450`,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0,
      tags: tags.length > 0 ? tags : ['General'],
      status: 'published' as const
    };

    addBlog(newPost);
    localStorage.removeItem(DRAFT_KEY);
    navigate(PageRoute.BLOG);
  };

  return (
    <div className="pt-8 pb-20 px-4 min-h-screen max-w-5xl mx-auto animate-fadeUp">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={coverInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleCoverFileChange}
      />
      <input 
        type="file" 
        ref={contentImageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleContentImageFileChange}
      />

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <button 
          onClick={() => navigate(PageRoute.BLOG)}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          <ChevronLeft size={20} />
          <span>返回列表</span>
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-slate-500 mr-2 hidden sm:block">
            {content.length} 字
          </div>
          
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
            title="保存草稿 (Save Draft)"
          >
            <Save size={16} />
            <span className="hidden sm:inline">保存草稿</span>
          </button>

          {hasDraft && (
            <button 
              onClick={handleDeleteDraft}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all text-sm font-medium"
              title="删除草稿 (Delete Draft)"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">删除草稿</span>
            </button>
          )}

          <button 
            onClick={handlePublish}
            className="bg-[#39ff14] hover:bg-[#32d712] text-black font-bold px-8 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transform hover:-translate-y-0.5"
          >
            发布博客
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title Input */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
             <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Type size={16} />
                <span className="text-xs uppercase tracking-wider">Title</span>
             </div>
             <input 
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="请输入博客标题..."
               className="w-full bg-transparent text-3xl font-bold text-white placeholder-gray-700 border-none outline-none focus:ring-0 px-0"
             />
          </div>

          {/* Content Editor */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl min-h-[500px] relative">
             {/* Toolbar */}
             <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4 sticky top-0 bg-[#0a0a0a] z-10">
                <button 
                  onClick={handleContentImageClick} 
                  className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors group relative" 
                  title="插入图片"
                >
                   <ImageIcon size={20} />
                   <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">上传配图</span>
                </button>
                <button onClick={() => setShowCodeModal(true)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors" title="插入代码">
                   <Code size={20} />
                </button>
                <div className="w-[1px] h-6 bg-gray-800 mx-2"></div>
                <div className="text-xs text-gray-500">支持 Markdown 语法</div>
             </div>

             <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始撰写你的精彩博客..."
                className="w-full h-full bg-transparent text-gray-300 text-lg placeholder-gray-700 resize-none focus:outline-none min-h-[400px] leading-relaxed font-mono"
             />

             {/* Content Images Preview Grid */}
             {images.length > 0 && (
               <div className="mt-6 pt-6 border-t border-gray-800">
                 <h4 className="text-xs font-bold text-gray-500 mb-4">已添加的配图 ({images.length})</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video group rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
                        <img src={img} alt="content" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Meta & Settings */}
        <div className="lg:col-span-1 space-y-6">
           {/* Cover Image */}
           <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Layout size={16} />
                    <span className="text-sm font-medium">封面缩略图</span>
                 </div>
              </div>
              <div 
                onClick={handleCoverClick}
                className="aspect-video bg-gray-900 cursor-pointer group relative overflow-hidden"
              >
                 {cover ? (
                   <>
                     <img src={cover} alt="Cover" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">更换封面</span>
                     </div>
                   </>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 group-hover:text-indigo-400 transition-colors">
                      <Plus size={32} className="mb-2"/>
                      <span className="text-sm">点击上传封面</span>
                   </div>
                 )}
              </div>
           </div>

           {/* Tags */}
           <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                 <Hash size={16} />
                 <span className="text-sm font-medium">标签管理</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                 {tags.map(tag => (
                   <span key={tag} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                     #{tag}
                     <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-white"><X size={12}/></button>
                   </span>
                 ))}
              </div>

              <div className="relative">
                 <input 
                   type="text" 
                   value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   onFocus={() => setShowTagSelector(true)}
                   onKeyDown={handleKeyDown}
                   placeholder="输入标签回车..."
                   className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                 />
                 
                 {showTagSelector && (
                   <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="text-xs text-gray-500 mb-2">常用标签：</div>
                      <div className="flex flex-wrap gap-2">
                         {PRESET_TAGS.map(tag => (
                           <button 
                             key={tag}
                             onClick={() => handleAddTag(tag)}
                             disabled={tags.includes(tag)}
                             className={`text-xs px-2 py-1 rounded border transition-colors ${
                               tags.includes(tag) 
                                 ? 'bg-indigo-900/30 border-indigo-900 text-indigo-300 opacity-50' 
                                 : 'bg-black border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                             }`}
                           >
                             {tag}
                           </button>
                         ))}
                      </div>
                      <button 
                        onClick={() => setShowTagSelector(false)} 
                        className="mt-2 w-full text-center text-xs text-gray-600 hover:text-gray-400 py-1"
                      >
                        收起
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Code Block Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
           <div className="bg-[#0d0d0d] border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Terminal size={18} className="text-[#39ff14]"/> 
                 选择语言
              </h3>
              
              <div className="mb-6 relative">
                 <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-black border border-gray-700 text-white rounded-lg p-3 appearance-none focus:border-[#39ff14] outline-none cursor-pointer"
                 >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="java">Java</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={16}/>
              </div>

              <div className="flex gap-3">
                 <button 
                    onClick={() => setShowCodeModal(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                 >
                    取消
                 </button>
                 <button 
                    onClick={confirmCodeBlock}
                    className="flex-1 py-2 rounded-lg bg-[#39ff14] text-black font-bold hover:bg-[#32d712] transition-colors"
                 >
                    插入
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
