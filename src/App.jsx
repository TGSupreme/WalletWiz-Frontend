import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="app-shell">
        {/* Fixed Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            WalletWiz
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Online
          </div>
        </header>

        {/* Viewport content */}
        <main className="screen-viewport">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </main>

        {/* Temporary Navigation (to be replaced by Floating Action Button in Stage 4) */}
        <nav className="flex justify-around items-center py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs shrink-0 z-10">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-violet-500 p-2">
            <span>💬 Chat</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-1 text-slate-500 hover:text-violet-500 p-2">
            <span>📊 Stats</span>
          </Link>
          <Link to="/transactions" className="flex flex-col items-center gap-1 text-slate-500 hover:text-violet-500 p-2">
            <span>💸 History</span>
          </Link>
          <Link to="/login" className="flex flex-col items-center gap-1 text-slate-500 hover:text-violet-500 p-2">
            <span>🔑 Auth</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
