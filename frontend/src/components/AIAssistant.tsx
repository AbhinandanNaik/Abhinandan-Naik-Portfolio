'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '@/store/telemetryStore';
import { Send, Bot, User, X, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Hi! I'm Abhinandan's digital assistant. Ask me anything about his technical stack, database audits, microservice projects, or credentials! 👋" }
  ]);
  const [loading, setLoading] = useState(false);

  const msgsEndRef = useRef<HTMLDivElement>(null);
  const trackAction = useTelemetryStore((state) => state.trackAction);

  // Auto-scroll on new messages
  useEffect(() => {
    if (msgsEndRef.current) {
      msgsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    trackAction('AI_CHAT_MESSAGE', textToSend.substring(0, 50));

    // Append User Message
    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      // API call to Spring Boot
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (!res.ok) throw new Error('API down');
      const data = await res.json();
      
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (e) {
      // Local fallback simulation in case the backend is down
      console.warn('AI API disconnected. Running local keyword matcher.');
      setTimeout(() => {
        const localReply = getLocalMatchingReply(textToSend);
        setMessages((prev) => [...prev, { sender: 'bot', text: localReply }]);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const getLocalMatchingReply = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('experience') || lower.includes('work') || lower.includes('digit') || lower.includes('job')) {
      return "Abhinandan Naik is a Backend Developer at Digit Insurance (2024-Present). He works with Java 21, Spring Boot 3.5, and PostgreSQL to scale claims and payment services. 💼";
    }
    if (lower.includes('project') || lower.includes('trackwise') || lower.includes('smart bin')) {
      return "He has built TrackWise (an Enterprise Asset Tracker with JPA, Postgres, Flyway, and React) and a Smart Bin Waste Optimizer (using ESP8266 & route optimization algorithms). 🚀";
    }
    if (lower.includes('skill') || lower.includes('technology') || lower.includes('tech') || lower.includes('java')) {
      return "Abhinandan specializes in Java 21, Spring Boot 3.5, Spring Security, JWT, PostgreSQL, Redis, Docker, and AWS basics. He also writes React 19 & Next.js 15 for frontends. ☕";
    }
    if (lower.includes('contact') || lower.includes('hire') || lower.includes('email')) {
      return "You can reach Abhinandan via the contact form or directly at abhinandan@email.com. He is open to discussions about backend engineer placements! 📧";
    }
    return "I couldn't reach the AI server, but I can tell you that Abhinandan is a Backend Developer experienced in building Java microservices. Try asking about his projects or skills! 🤖";
  };

  const handleSuggestion = (q: string) => {
    handleSendMessage(q);
  };

  const handleToggle = () => {
    trackAction('TOGGLE_AI_CHAT', isOpen ? 'CLOSE' : 'OPEN');
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-accent to-secondary text-bg flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:scale-110 hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] transition-all duration-300 z-50 cursor-pointer"
        title="Ask Abhinandan's AI"
      >
        <Bot size={24} />
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[460px] bg-[#0A0A16]/95 border border-accent/25 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-accent/8 p-4 border-b border-accent/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center text-bg font-bold text-xs select-none">
                <Bot size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono">AN Systems AI</div>
                <div className="text-[9px] text-highlight font-mono tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-ping"></span>
                  SYSTEM ONLINE
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m, index) => {
              const isBot = m.sender === 'bot';
              return (
                <div 
                  key={index}
                  className={`flex gap-2 max-w-[85%] text-xs leading-relaxed p-3 rounded-lg ${
                    isBot 
                      ? 'bg-accent/5 border border-accent/10 text-white self-start rounded-bl-none' 
                      : 'bg-secondary/15 border border-secondary/25 text-white self-end rounded-br-none'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isBot ? <Bot size={12} className="text-accent" /> : <User size={12} className="text-secondary" />}
                  </div>
                  <p className="whitespace-pre-line select-text">{m.text}</p>
                </div>
              );
            })}
            
            {loading && (
              <div className="bg-accent/5 border border-accent/10 text-white self-start rounded-lg rounded-bl-none p-3 max-w-[85%] text-xs flex items-center gap-2 font-mono">
                <Bot size={12} className="text-accent animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>

          {/* Preset Suggestion Buttons */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-col gap-1.5 select-none">
              {[
                'What technologies does Abhinandan use?',
                'Tell me about TrackWise project',
                'Where does he work currently?'
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className="text-left text-[10px] text-muted hover:text-accent border border-white/5 bg-white/2 hover:bg-accent/5 hover:border-accent/30 p-2 rounded transition-colors duration-250 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat input footer */}
          <div className="p-3 border-t border-white/5 bg-white/2 flex gap-2">
            <input
              type="text"
              placeholder="Ask about Abhinandan..."
              className="flex-1 bg-white/3 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-muted/50 focus:outline-none focus:border-accent"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              className="bg-accent hover:opacity-85 text-bg p-2 rounded transition-opacity duration-200 shrink-0 cursor-pointer"
              disabled={loading || !inputVal.trim()}
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
