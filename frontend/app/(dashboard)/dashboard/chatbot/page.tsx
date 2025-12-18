'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { Send, Terminal, User, Bot, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Bonjour! Je suis Bob, votre assistant RH intelligent. Comment puis-je vous aider avec vos questions sur les ressources humaines, formations, ou politiques de l'entreprise?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', { query: currentInput });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900/50 border border-slate-800 rounded-lg">
            <Terminal className="w-6 h-6 text-safran-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">RH Assistant</h1>
            <p className="text-sm text-slate-400">Intelligence Artificielle RH</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-400 ml-2 font-mono">safran-rh-assistant ~ terminal</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
              {message.type === 'bot' && (
                <div className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <Bot className="w-4 h-4 text-safran-orange" />
                </div>
              )}

              <div className={`flex-1 max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                <div className={`p-4 rounded-lg border ${
                  message.type === 'user'
                    ? 'bg-safran-orange/10 border-safran-orange/20 text-slate-100'
                    : 'bg-slate-800/30 border-slate-700 text-slate-100'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {message.type === 'user' && (
                <div className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <Bot className="w-4 h-4 text-safran-orange" />
              </div>
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question RH..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-safran-orange focus:border-transparent font-mono text-sm"
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-safran-orange hover:bg-safran-orange/90 disabled:bg-safran-orange/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-safran-orange focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Questions sur congés, formations, avantages sociaux, évaluations...
          </p>
        </div>
      </div>
    </div>
  );
}