import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, PieChart, List } from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white dark:bg-card-dark border-t border-slate-100 dark:border-border-dark px-6 py-2 flex items-center justify-between shrink-0 z-40 shadow-xs transition-colors duration-300 pb-safe">
      {/* Nav: Chat */}
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-all duration-200 ${
          isActive('/') 
            ? 'text-violet-600 dark:text-violet-400 font-bold scale-105' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px]">Chat</span>
      </button>

      {/* Nav: Stats */}
      <button
        onClick={() => navigate('/analytics')}
        className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-all duration-200 ${
          isActive('/analytics') 
            ? 'text-violet-600 dark:text-violet-400 font-bold scale-105' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <PieChart className="w-5 h-5" />
        <span className="text-[10px]">Stats</span>
      </button>

      {/* Nav: History */}
      <button
        onClick={() => navigate('/transactions')}
        className={`flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-all duration-200 ${
          isActive('/transactions') 
            ? 'text-violet-600 dark:text-violet-400 font-bold scale-105' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <List className="w-5 h-5" />
        <span className="text-[10px]">History</span>
      </button>
    </div>
  );
}
