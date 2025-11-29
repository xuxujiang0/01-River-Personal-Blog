import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Upload, Tag, ArrowLeft } from 'lucide-react';
import * as authApi from '../api/auth';
import { useAppStore } from '../store';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAppStore();
  
  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // 验证状态
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  
  // 密码强度
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  
  // 提交状态
  const [isLoading, setIsLoading] = useState(false);

  // 验证用户名
  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError('请输入账号');
      return false;
    }
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
      setUsernameError('账号需为4-20位字母、数字或下划线');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // 验证密码
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('请输入密码');
      setPasswordStrength('');
      return false;
    }
    if (value.length < 6 || value.length > 20) {
      setPasswordError('密码长度需为6-20位字符');
      setPasswordStrength('');
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasLetter || !hasNumber) {
      setPasswordError('密码需同时包含字母和数字');
      setPasswordStrength('weak');
      return false;
    }
    
    setPasswordError('');
    
    // 计算密码强度
    if (hasLetter && hasNumber && hasSpecial && value.length >= 12) {
      setPasswordStrength('strong');
    } else if (hasLetter && hasNumber && (hasSpecial || value.length >= 10)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
    
    return true;
  };

  // 验证昵称
  const validateNickname = (value: string) => {
    if (!value.trim()) {
      setNicknameError('请输入昵称');
      return false;
    }
    if (value.length > 20) {
      setNicknameError('昵称最多20个字符');
      return false;
    }
    setNicknameError('');
    return true;
  };

  // 处理头像上传
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setAvatarError('仅支持JPG/PNG格式图片');
      return;
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('图片大小不能超过10MB');
      return;
    }

    setAvatarError('');
    setAvatar(file);

    // 生成预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 获取密码强度文本和颜色
  const getPasswordStrengthInfo = () => {
    switch (passwordStrength) {
      case 'weak':
        return { text: '弱', color: 'text-red-500' };
      case 'medium':
        return { text: '中', color: 'text-yellow-500' };
      case 'strong':
        return { text: '强', color: 'text-green-500' };
      default:
        return { text: '', color: '' };
    }
  };

  // 检查表单是否有效
  const isFormValid = () => {
    return (
      username &&
      password &&
      nickname &&
      avatar &&
      !usernameError &&
      !passwordError &&
      !nicknameError &&
      !avatarError
    );
  };

  // 提交注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 最终验证
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isNicknameValid = validateNickname(nickname);

    if (!isUsernameValid || !isPasswordValid || !isNicknameValid || !avatar) {
      window.toast?.error('请正确填写所有必填项');
      return;
    }

    setIsLoading(true);
    try {
      // 先上传头像
      const avatarUrl = await authApi.uploadAvatar(avatar);
      
      // 注册
      const response = await authApi.register({
        username,
        password,
        nickname,
        avatar: avatarUrl,
      });

      // 保存登录信息
      authApi.saveLoginInfo(response);
      
      // 更新 store 中的用户状态（使用注册时的账号密码登录）
      await storeLogin({ username, password });
      
      window.toast?.success('注册成功！');
      // 跳转到首页
      navigate('/');
    } catch (error: any) {
      console.error('注册失败:', error);
      window.toast?.error(error?.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回首页</span>
        </button>

        {/* 注册表单 */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider">CREATE ACCOUNT</h2>
            <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
              Join River Blog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 账号 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">
                账号 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                  }}
                  onBlur={() => validateUsername(username)}
                  placeholder="4-20位字母、数字或下划线"
                  className={`w-full bg-gray-900/50 border ${
                    usernameError ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {usernameError && (
                <p className="text-xs text-red-500 mt-1">{usernameError}</p>
              )}
              {!usernameError && username && (
                <p className="text-xs text-green-500 mt-1">✓ 格式正确</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="6-20位，需含字母和数字"
                  className={`w-full bg-gray-900/50 border ${
                    passwordError ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
              {!passwordError && strengthInfo.text && (
                <p className={`text-xs ${strengthInfo.color} mt-1`}>
                  密码强度：{strengthInfo.text}
                </p>
              )}
            </div>

            {/* 昵称 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">
                昵称 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    validateNickname(e.target.value);
                  }}
                  onBlur={() => validateNickname(nickname)}
                  placeholder="输入你的昵称"
                  maxLength={20}
                  className={`w-full bg-gray-900/50 border ${
                    nicknameError ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
              </div>
              <div className="flex justify-between mt-1">
                {nicknameError ? (
                  <p className="text-xs text-red-500">{nicknameError}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {nickname.length}/20 字符
                  </p>
                )}
              </div>
            </div>

            {/* 头像上传 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">
                头像 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                {/* 预览区域 */}
                <div className="w-20 h-20 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="头像预览" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-gray-600" size={32} />
                  )}
                </div>
                
                {/* 上传按钮 */}
                <div className="flex-1">
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-lg p-4 text-center transition-colors">
                      <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                      <p className="text-xs text-gray-400">
                        点击上传头像
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        JPG/PNG，最大10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              {avatarError && (
                <p className="text-xs text-red-500 mt-2">{avatarError}</p>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/30 mt-6"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 已有账号 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              已有账号？{' '}
              <button
                onClick={() => navigate('/')}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                返回登录
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
