/**
 * 图片加载测试工具
 * 用于验证各种图片路径是否能正确加载
 */

import React, { useState } from 'react';

interface ImageTestCase {
  name: string;
  url: string;
  description: string;
}

export const ImageLoadTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  const testCases: ImageTestCase[] = [
    {
      name: 'admin-svg',
      url: '/admin-avatar.svg',
      description: '管理员SVG头像（public目录）'
    },
    {
      name: 'user-svg',
      url: '/user-avatar.svg',
      description: '用户SVG头像（public目录）'
    },
    {
      name: 'api-files',
      url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/files/test.jpg`,
      description: '后端上传文件路径测试'
    },
    {
      name: 'picsum',
      url: 'https://picsum.photos/seed/test/200/200',
      description: '外部完整URL测试'
    }
  ];

  const handleImageLoad = (name: string) => {
    console.log(`[图片测试] ${name} 加载成功`);
    setTestResults(prev => ({ ...prev, [name]: 'success' }));
  };

  const handleImageError = (name: string) => {
    console.error(`[图片测试] ${name} 加载失败`);
    setTestResults(prev => ({ ...prev, [name]: 'error' }));
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">🖼️ 图片加载测试工具</h1>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">测试说明</h2>
        <p className="text-gray-300 text-sm">
          此工具用于测试各种图片路径是否能正确加载。打开浏览器控制台查看详细日志。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCases.map((test) => (
          <div key={test.name} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{test.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{test.description}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-bold ${
                testResults[test.name] === 'success' ? 'bg-green-500/20 text-green-400' :
                testResults[test.name] === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-700 text-gray-400'
              }`}>
                {testResults[test.name] === 'success' ? '✅ 成功' :
                 testResults[test.name] === 'error' ? '❌ 失败' :
                 '⏳ 加载中'}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">URL路径：</p>
              <code className="text-xs text-cyan-400 bg-gray-900 p-2 rounded block break-all">
                {test.url}
              </code>
            </div>

            <div className="flex justify-center items-center bg-gray-900 rounded p-4 h-48">
              <img
                src={test.url}
                alt={test.name}
                className="max-w-full max-h-full object-contain"
                onLoad={() => handleImageLoad(test.name)}
                onError={() => handleImageError(test.name)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">测试结果统计</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-500/10 p-4 rounded">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {Object.values(testResults).filter(r => r === 'success').length}
            </div>
            <div className="text-sm text-gray-400">成功</div>
          </div>
          <div className="bg-red-500/10 p-4 rounded">
            <div className="text-3xl font-bold text-red-400 mb-1">
              {Object.values(testResults).filter(r => r === 'error').length}
            </div>
            <div className="text-sm text-gray-400">失败</div>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-3xl font-bold text-gray-400 mb-1">
              {testCases.length - Object.keys(testResults).length}
            </div>
            <div className="text-sm text-gray-400">加载中</div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
        <h2 className="text-lg font-bold text-blue-400 mb-2">💡 调试提示</h2>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• 打开浏览器开发者工具（F12）查看详细日志</li>
          <li>• 检查 Network 标签查看网络请求</li>
          <li>• 确保前后端服务都已启动</li>
          <li>• SVG 文件应该在 frontend/public/ 目录</li>
          <li>• 上传文件应该在 backend/uploads/ 目录</li>
        </ul>
      </div>
    </div>
  );
};
