import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import InlineTransactionCard from '../components/chat/InlineTransactionCard';
import { Send, Bot, User, PlusCircle } from 'lucide-react';

export default function Chat({ onOpenAddModal }) {
  const { messages, loading, sendMessage, clearChat } = useChat();
  const { user } = useAuth();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const textToSend = inputText;
    setInputText('');
    
    try {
      await sendMessage(textToSend);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-bg-dark transition-colors duration-300">
      
      {/* Chat Sub-Header removed for more viewport space */}

      {/* Message Timeline Viewport */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, idx) => {
          const isUser = message.role === 'user';
          
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar Icons */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center shrink-0 border border-violet-500/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble Text */}
                <div className={`text-xs px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  isUser 
                    ? 'bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-500/10' 
                    : 'bg-white dark:bg-card-dark text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-border-dark rounded-bl-none shadow-xs'
                }`}>
                  <span>{message.content}</span>
                </div>

                {/* Inline Transaction Card Render (Log Transaction Tool) */}
                {!isUser && message.tool_triggered === 'log_transaction' && message.metadata?.query_filters && (
                  <InlineTransactionCard transactionData={message.metadata.query_filters} />
                )}

                {/* Inline Query Badge (Query Database Tool) */}
                {!isUser && message.tool_triggered === 'query_database' && message.metadata && (
                  <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-border-dark px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                    Gemini resolved: {message.metadata.results_count || 0} matching records
                  </div>
                )}
                
                {/* Timestamp */}
                <span className="text-[8px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Pulse Dot Loader */}
        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center shrink-0 border border-violet-500/20">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white dark:bg-card-dark text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-border-dark rounded-2xl rounded-bl-none px-4 py-3.5 shadow-xs flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        {/* Scrolling Target anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Bar */}
      <div className="p-4 bg-white dark:bg-card-dark border-t border-slate-100 dark:border-border-dark shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Wiz is processing query..." : "Ask Wiz: 'How much spent on groceries?'"}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-xs focus:outline-none transition-colors duration-200 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="w-11 h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white flex items-center justify-center rounded-2xl shadow-md shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-11 h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark text-slate-450 hover:text-violet-500 hover:border-violet-500 flex items-center justify-center rounded-2xl active:scale-95 transition-all cursor-pointer shrink-0"
            title="Log Expense Manually"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}
