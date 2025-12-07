import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed inset-x-0 top-24 z-[10000] flex justify-center pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-sm
                    ${getStyles()} 
                    animate-slideDown shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
      >
        {getIcon()}
        <span className="text-white text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = '确认操作',
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-md px-4">
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scaleIn">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white text-lg font-bold text-center mb-2 font-mono">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-400 text-sm text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium shadow-lg shadow-indigo-900/30"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
