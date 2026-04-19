import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  RefreshCw,
  User,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';


function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center flex-shrink-0">
        <Zap className="w-4 h-4 text-black" fill="currentColor" />
      </div>
      <div className="bg-[#1a1a1a] border border-[#222] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatView() {
  const { messages, isChatLoading, sendMessage, clearChat } = useAppStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isChatLoading) return;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto h-full flex flex-col pb-6"
      style={{ height: 'calc(100vh - 8rem)' }}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm text-white font-['Space_Grotesk'] font-medium">{t('chat_agent_name')}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-[#555] font-['Space_Grotesk']">{t('chat_agent_status')}</p>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 text-xs text-[#555] hover:text-[#C9A84C] font-['Space_Grotesk'] transition-colors p-2 rounded-lg hover:bg-[#C9A84C]/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('chat_btn_clear')}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-[#C9A84C] to-[#8B6914]'
                  : 'bg-[#222] border border-[#333]'
              }`}>
                {msg.role === 'assistant' ? (
                  <Zap className="w-4 h-4 text-black" fill="currentColor" />
                ) : (
                  <User className="w-4 h-4 text-[#888]" />
                )}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm font-['Space_Grotesk'] font-light leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#C9A84C] text-black rounded-br-sm'
                      : 'bg-[#1a1a1a] border border-[#222] text-[#ccc] rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-[10px] text-[#444] font-['Space_Grotesk'] px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isChatLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 flex-shrink-0"
        >
          <p className="text-[10px] text-[#444] font-['Space_Grotesk'] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            {t('chat_quick_prompts')}
          </p>
          <div className="flex flex-wrap gap-2">
            {(t('chat_quick_prompts_list') as unknown as string[]).map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isChatLoading}
                className="text-xs bg-[#111] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#C9A84C]/30 text-[#777] hover:text-[#C9A84C] px-3 py-1.5 rounded-full font-['Space_Grotesk'] transition-all duration-200 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 mt-3">
        <div className="flex gap-3 bg-[#111] border border-[#222] focus-within:border-[#C9A84C]/40 rounded-2xl p-3 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat_placeholder') as string}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm font-['Space_Grotesk'] font-light placeholder:text-[#444] resize-none outline-none leading-relaxed"
            style={{ minHeight: '28px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isChatLoading}
            className="w-8 h-8 flex items-center justify-center bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-40 disabled:hover:bg-[#C9A84C] rounded-xl flex-shrink-0 transition-all duration-200 mt-0.5"
          >
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
        <p className="text-[10px] text-[#333] font-['Space_Grotesk'] text-center mt-2">
          {t('chat_disclaimer')}
        </p>
      </div>
    </motion.div>
  );
}
