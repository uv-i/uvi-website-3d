import React, { useState, useEffect, useRef } from 'react';
import { Minimize2, X, Send, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useIdle } from '../../hooks/useIdle';
import { AIService } from '../../services/aiService';
import { CHATBOT_PERSONA } from '../../data/mockData';

// How long each bubble fact stays visible before cycling to the next (ms)
const CYCLE_MS = 90_000; // 90 seconds ≈ 1.5 min — change here to adjust

// ── Page link detection ────────────────────────────────────────────────────────
const PAGE_LINKS = [
  { keywords: ['dev lab', '/lab', 'teaching repo', 'unity tutorial', 'unity repo', 'tutorial repo'], route: '/lab', label: 'Dev Lab' },
  { keywords: ['uv originals', 'uv original', 'guess in 10', 'originals tab', 'our games', 'game library'], route: '/games', label: 'Our Games' },
  { keywords: ['games page', 'games tab', 'client work', 'client tab', 'see all games', 'fortnite project', 'projects page'], route: '/games', label: 'Games' },
  { keywords: ['contact page', 'contact form', 'start a project', 'work with us', 'get in touch', 'reach out', 'send a message'], route: '/contact', label: 'Contact Us' },
];

const extractPageLinks = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  for (const page of PAGE_LINKS) {
    if (page.keywords.some(kw => lower.includes(kw))) {
      if (!found.find(f => f.route === page.route)) found.push(page);
    }
  }
  return found;
};

// ── Component ──────────────────────────────────────────────────────────────────
const ChatBot = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isIdle = useIdle(4000);

  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const cycleRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const intro = CHATBOT_PERSONA.intros[Math.floor(Math.random() * CHATBOT_PERSONA.intros.length)];
    return [{ role: 'assistant', text: intro }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isOpen]);

  // Show bubble after idle
  useEffect(() => {
    const isHiddenPage = ['/games', '/lab'].includes(location.pathname);
    if (!isIdle || isOpen || showWelcome || isHiddenPage) return;
    setFactIndex(0);
    setShowWelcome(true);
  }, [isIdle, location.pathname, isOpen, showWelcome]);

  // Cycle facts while bubble is visible
  useEffect(() => {
    if (!showWelcome) { clearInterval(cycleRef.current); return; }
    cycleRef.current = setInterval(() => {
      setFactIndex(i => (i + 1) % CHATBOT_PERSONA.facts.length);
    }, CYCLE_MS);
    return () => clearInterval(cycleRef.current);
  }, [showWelcome]);

  const activeFact = CHATBOT_PERSONA.facts[factIndex];

  const handleBubbleClick = () => {
    clearInterval(cycleRef.current);
    if (activeFact?.route) {
      setShowWelcome(false);
      navigate(activeFact.route);
    } else {
      setIsOpen(true);
      setShowWelcome(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    const replyText = await AIService.generateContent(input, CHATBOT_PERSONA.systemPrompt);
    const links = extractPageLinks(replyText);
    setMessages(prev => [...prev, { role: 'assistant', text: replyText, links }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* ── Engagement bubble ──────────────────────────────────────────────── */}
      {showWelcome && !isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 animate-[bounce_3s_infinite] cursor-pointer"
          onClick={handleBubbleClick}
        >
          <div className={`relative backdrop-blur-xl border px-5 pt-4 pb-5 rounded-2xl rounded-br-none shadow-lg max-w-[240px] overflow-hidden transition-all ${
            isDark ? 'bg-gray-900/95 border-yellow-500 text-white' : 'bg-white/95 border-yellow-500 text-gray-900'
          }`}>
            {/* Header */}
            <p className="font-bold text-sm flex items-center gap-2 mb-2">
              <span className="text-xl">🦁</span> Leo says:
            </p>

            {/* Fact text — key forces remount so text animates in on change */}
            <p key={`text-${factIndex}`} className="text-xs font-medium mb-2 animate-[fadeIn_0.4s_ease-out]">
              {activeFact?.text}
            </p>

            {/* CTA arrow if navigable */}
            {activeFact?.route && (
              <p className={`text-[10px] font-bold flex items-center gap-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                <ArrowRight size={10} /> {activeFact.routeLabel}
              </p>
            )}

            {/* Dismiss button */}
            <button
              onClick={(e) => { e.stopPropagation(); clearInterval(cycleRef.current); setShowWelcome(false); }}
              className="absolute -top-2 -right-2 bg-gray-800 border border-gray-600 rounded-full p-1 text-gray-400 hover:text-white hover:bg-red-500"
            >
              <X size={12} />
            </button>

            {/* Progress bar — key restarts animation on each new fact */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-yellow-900/30 rounded-b-2xl overflow-hidden">
              <div
                key={`bar-${factIndex}`}
                className="h-full bg-yellow-500 origin-left"
                style={{
                  animation: `leoBubbleShrink ${CYCLE_MS}ms linear forwards`,
                }}
              />
            </div>
          </div>

          {/* Fact counter dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {CHATBOT_PERSONA.facts.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === factIndex
                    ? 'w-4 h-1.5 bg-yellow-500'
                    : 'w-1.5 h-1.5 bg-yellow-500/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-red-500 rotate-90 text-white' : 'bg-gradient-to-tr from-yellow-500 to-amber-600 text-white'
        }`}
      >
        {isOpen ? <X /> : <span className="text-2xl">🦁</span>}
      </button>

      {/* ── Chat window ────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-96 h-[500px] backdrop-blur-xl border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out] ${
          isDark ? 'bg-gray-900/95 border-yellow-500/30' : 'bg-white/95 border-yellow-500/30'
        }`}>
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-2xl border border-white/30">🦁</div>
            <div>
              <h3 className="font-bold text-white text-sm">Leo the Cub</h3>
              <p className="text-xs text-yellow-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto text-white/70 hover:text-white">
              <Minimize2 size={18} />
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${
            isDark ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-300'
          }`}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : `${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} border rounded-bl-none`
                }`}>
                  {msg.text}
                </div>
                {msg.role === 'assistant' && msg.links?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                    {msg.links.map(link => (
                      <button
                        key={link.route}
                        onClick={() => { setIsOpen(false); navigate(link.route); }}
                        className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 ${
                          isDark
                            ? 'border-yellow-500/50 text-yellow-400 bg-yellow-900/15 hover:bg-yellow-900/30'
                            : 'border-yellow-500/60 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                        }`}
                      >
                        <ArrowRight size={10} /> {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <span className="p-2 text-xs italic opacity-50">Leo is thinking…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={`p-3 border-t ${
            isDark ? 'bg-black/50 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Leo anything…"
                className={`w-full text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 border ${
                  isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1 top-1 p-2 bg-amber-500 rounded-full text-white hover:bg-amber-600 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
