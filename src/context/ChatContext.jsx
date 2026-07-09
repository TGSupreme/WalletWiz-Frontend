import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('walletwiz_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: 'Hi! I am WalletWiz AI, your personal finance assistant. Ask me to log an expense (e.g. "spent 350 at Starbucks on UPI") or query your data!',
        timestamp: new Date().toISOString(),
      }
    ];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('walletwiz_chat_history', JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    const defaultWelcome = {
      role: 'assistant',
      content: 'Hi! I am WalletWiz AI, your personal finance assistant. Ask me to log an expense (e.g. "spent 350 at Starbucks on UPI") or query your data!',
      timestamp: new Date().toISOString(),
    };
    setMessages([defaultWelcome]);
    localStorage.removeItem('walletwiz_chat_history');
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    // Format history for API payload (only role and content)
    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await chatAPI.sendQuery(text, historyPayload);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response || 'I processed your query, but could not retrieve a clear text response.',
        tool_triggered: response.tool_triggered,
        metadata: response.metadata,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
