import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider, useChat } from './context/ChatContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import BottomNavigation from './components/layout/BottomNavigation';
import AddExpenseModal from './components/ui/AddExpenseModal';
import Toast from './components/ui/Toast';
import { setToastCallback } from './services/api';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Auth from './pages/Auth';
import logoImg from './assets/logo.png';
import { Sun, Moon, LogOut, Trash2, Plus } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { clearChat } = useChat();
  const location = useLocation();
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  useEffect(() => {
    setToastCallback(showToast);
  }, []);

  return (
    <div className="app-shell">
        {/* Global Toast Alert */}
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />

        {/* Fixed Header (Only visible when logged in) */}
        {isAuthenticated && (
          <header className="flex items-center justify-between px-6 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0 select-none">
            <img src={logoImg} alt="WalletWiz Logo" className="w-13 h-13 object-contain select-none" />
            
            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Add Expense (Global Plus Trigger) */}
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                title="Log New Expense"
                className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark text-slate-400 hover:text-violet-500 rounded-xl cursor-pointer transition-all duration-150"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Clear Chat (Only visible on Chat tab) */}
              {location.pathname === '/' && (
                <button 
                  onClick={clearChat} 
                  title="Clear Chat History"
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark text-slate-400 hover:text-rose-500 rounded-xl cursor-pointer transition-all duration-150"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                title="Toggle Mode"
                className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer transition-all duration-150"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Log Out */}
              <button 
                onClick={logout} 
                title="Log Out"
                className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark text-slate-400 hover:text-rose-500 rounded-xl cursor-pointer transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>
        )}

        {/* Viewport content */}
        <main className="screen-viewport">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </main>

        {/* Bottom Tab Bar Navigation */}
        {isAuthenticated && (
          <BottomNavigation />
        )}

        {/* Manual Log Expense Modal Form */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            console.log('New transaction successfully saved');
          }}
          showToast={showToast}
        />
      </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <AppContent />
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
