import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import './Toast.css';

const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const colors = { success: 'green', error: 'red', warning: 'orange', info: 'blue' };

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className={`toast toast-${colors[t.type] || 'blue'}`}>
            <Icon size={18} />
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)}><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}
