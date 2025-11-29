interface ToastMethods {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  confirm: (
    message: string,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
    }
  ) => Promise<boolean>;
}

interface Window {
  toast: ToastMethods;
}
