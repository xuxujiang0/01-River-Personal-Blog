import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import * as authApi from '../api/auth';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSuccess: (newAvatarUrl: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ 
  isOpen, 
  onClose, 
  currentAvatar,
  onSuccess 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('仅支持 JPG/PNG 格式图片');
      return;
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // 生成预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      window.toast?.error('请先选择要上传的头像');
      return;
    }

    setIsUploading(true);
    try {
      // 上传头像
      const avatarUrl = await authApi.uploadAvatar(selectedFile);
      
      // 更新用户头像
      await authApi.updateUserAvatar(avatarUrl);
      
      window.toast?.success('头像修改成功！');
      onSuccess(avatarUrl);
      handleClose();
    } catch (error: any) {
      console.error('头像上传失败:', error);
      window.toast?.error(error?.message || '头像上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    onClose();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ margin: 0, padding: '1rem' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-scaleInCenter"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">修改头像</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Current Avatar */}
        {currentAvatar && !preview && (
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">当前头像</p>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/30">
              <img 
                src={currentAvatar} 
                alt="当前头像" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">新头像预览</p>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500/50">
              <img 
                src={preview} 
                alt="新头像预览" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Upload Area */}
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-lg p-8 text-center transition-all duration-200">
            <Upload className="mx-auto text-gray-500 mb-3" size={32} />
            <p className="text-sm text-gray-300 mb-1">
              {selectedFile ? selectedFile.name : '点击选择新头像'}
            </p>
            <p className="text-xs text-gray-500">
              支持 JPG/PNG，最大 10MB
            </p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={isUploading}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              selectedFile && !isUploading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Check size={18} />
                确认修改
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body，避免 z-index 层叠上下文问题
  return createPortal(modalContent, document.body);
};
