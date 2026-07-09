import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import FABNavigation from './components/layout/FABNavigation';
import AddExpenseModal from './components/ui/AddExpenseModal';
import Toast from './components/ui/Toast';
import { setToastCallback } from './services/api';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Auth from './pages/Auth';

function AppContent() {
  const { isAuthenticated } = useAuth();
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
    <Router>
      <div className="app-shell">
        {/* Global Toast Alert */}
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />

        {/* Fixed Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            WalletWiz
          </span>
          {isAuthenticated ? (
            <FABNavigation onOpenAddModal={() => setIsAddModalOpen(true)} />
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </div>
          )}
        </header>

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

        {/* Navigation is now integrated into the Header on the top-right */}

        {/* Manual Log Expense Modal Form */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            // Global hook for reloading data after manual save, will trigger Page context updates in Stage 6
            console.log('New transaction successfully saved');
          }}
          showToast={showToast}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
