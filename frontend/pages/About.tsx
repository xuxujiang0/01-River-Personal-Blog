import React from 'react';
import { Mail, MapPin, Briefcase, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-8 pb-12 px-4 max-w-4xl mx-auto min-h-screen flex flex-col md:flex-row gap-8 items-start">
       {/* Left Column: Profile */}
       <div className="w-full md:w-1/3 bg-slate-800 rounded-2xl p-6 border border-slate-700 sticky top-40">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30 mb-6">
             <img src="https://picsum.photos/id/64/300/300" alt="Me" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-1">River Xu</h2>
          <p className="text-indigo-400 text-center text-sm mb-6">顶级爱生活的无敌顾问</p>
          
          <div className="space-y-4 text-slate-300 text-sm">
             <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-slate-500"/>
                <span>Guangzhou, China</span>
             </div>
             <div className="flex items-center space-x-3">
                <Briefcase size={18} className="text-slate-500"/>
                <span>Available for freelance</span>
             </div>
             <div className="flex items-center space-x-3">
                <Mail size={18} className="text-slate-500"/>
                <span>riverxu8@gmail.com</span>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
             <h3 className="text-white font-medium mb-3">Tech Stack</h3>
             <div className="flex flex-wrap gap-2">
                {['吃饭', '睡觉', '打游戏', '看剧', '写Bug'].map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{t}</span>
                ))}
             </div>
          </div>
       </div>

       {/* Right Column: Content */}
       <div className="flex-1 space-y-12">
          <section>
             <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
               关于我 <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
             </h1>
             <div className="prose prose-invert text-slate-300 leading-relaxed">
                <p>
                   你好！我是 Alex，一名热衷于创造极致用户体验的前端工程师。拥有5年的开发经验，专注于构建高性能、可访问性强且视觉震撼的 Web 应用。
                </p>
                <p>
                   我不仅关注代码的整洁与架构的优雅，更痴迷于微交互带来的惊喜感。我相信好的设计不仅仅是外观，更是功能与情感的连接。
                </p>
             </div>
          </section>

          <section>
             <h2 className="text-2xl font-bold text-white mb-6">工作经历</h2>
             <div className="space-y-8 border-l-2 border-slate-700 ml-3 pl-8 relative">
                {[
                  { role: '徐氏集团董事长', company: '徐氏集团', year: '1989 - Present', desc: '负责整个集团的所有业务。' },
                ].map((job, i) => (
                   <div key={i} className="relative">
                      <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500"></span>
                      <h3 className="text-xl font-bold text-white">{job.role}</h3>
                      <div className="text-indigo-400 text-sm mb-2">{job.company} | {job.year}</div>
                      <p className="text-slate-400 text-sm">{job.desc}</p>
                   </div>
                ))}
             </div>
          </section>

          <section>
             <h2 className="text-2xl font-bold text-white mb-6">兴趣爱好</h2>
             <div className="grid grid-cols-2 gap-4">
                {['看风景', '吹吹水', '喝喝酒', '电子游戏'].map((hobby, i) => (
                   <div key={i} className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-3 text-slate-300">
                      <Heart size={18} className="text-pink-500" />
                      <span>{hobby}</span>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );
};