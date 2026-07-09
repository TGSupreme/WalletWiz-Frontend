import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, 
  PieChart, 
  List, 
  Sun, 
  Moon, 
  LogOut, 
  X,
  Menu,
  PlusCircle
} from 'lucide-react';

export default function FABNavigation({ onOpenAddModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop blur when menu is expanded */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-[9998] transition-all duration-300"
        />
      )}

      {/* Header Navigation Menu Container */}
      <div className="relative z-[9999]">
        {/* Toggle Menu Button in Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95 transition-all duration-200 cursor-pointer ${
            isOpen ? 'bg-violet-600 text-white! border-transparent' : ''
          }`}
        >
          {isOpen ? <X className="w-5 h-5 animate-spin-once" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Expanded Quick Actions Panel (Slides down from the Header Button) */}
        <div className={`absolute top-12 right-0 w-72 bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-3xl p-5 shadow-2xl transition-all duration-300 origin-top-right ${
          isOpen 
            ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' 
            : 'scale-90 opacity-0 pointer-events-none -translate-y-4'
        }`}>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3 text-center">
            WalletWiz Console
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Nav: Chat */}
            <button
              onClick={() => handleNavigation('/')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isActive('/') 
                  ? 'bg-violet-500/10 border-violet-500 text-violet-500 font-semibold' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Chat</span>
            </button>

            {/* Nav: Stats */}
            <button
              onClick={() => handleNavigation('/analytics')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isActive('/analytics') 
                  ? 'bg-violet-500/10 border-violet-500 text-violet-500 font-semibold' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PieChart className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Stats</span>
            </button>

            {/* Nav: History */}
            <button
              onClick={() => handleNavigation('/transactions')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isActive('/transactions') 
                  ? 'bg-violet-500/10 border-violet-500 text-violet-500 font-semibold' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <List className="w-5 h-5 mb-1" />
              <span className="text-[10px]">History</span>
            </button>

            {/* Action: Add Expense */}
            <button
              onClick={() => {
                onOpenAddModal();
                setIsOpen(false);
              }}
              className="col-span-3 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl font-semibold text-xs shadow-md shadow-violet-500/10 transition-all active:scale-98 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Log Manual Expense
            </button>

            {/* Utility: Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4.5 h-4.5 mb-1 text-amber-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4.5 h-4.5 mb-1 text-slate-600" />
                  Dark Mode
                </>
              )}
            </button>

            {/* Utility: Log Out */}
            <button
              onClick={logout}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
