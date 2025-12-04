import { AlertCircle, Check } from 'lucide-react';

const Toast = ({ notification }) => {
  if (!notification) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
      notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
      {notification.message}
    </div>
  );
};

export default Toast;
