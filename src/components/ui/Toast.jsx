import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type, visible, onClose }) {
  if (!visible) return null;

  const bgClass = {
    success: 'bg-emerald-600 text-white dark:bg-emerald-500',
    error: 'bg-rose-600 text-white dark:bg-rose-500',
    warning: 'bg-amber-600 text-white dark:bg-amber-500',
    info: 'bg-violet-600 text-white dark:bg-violet-500',
  }[type] || 'bg-slate-800 text-white';

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[type] || Info;

  return (
    <div className="absolute top-4 left-4 right-4 z-50 transition-all duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/10 ${bgClass}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold flex-1 leading-snug">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
