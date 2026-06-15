import React, { useState, useRef } from 'react';
import { Send, Sparkles, MapPin, Mail, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AIService } from '../services/aiService';
import { APP_CONFIG } from '../data/mockData';
import Button from '../components/atoms/Button';
import SectionHeader from '../components/atoms/SectionHeader';

// ── Info row ───────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, href, isDark }) => (
  <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
    isDark
      ? 'border-purple-900/30 bg-purple-900/5 hover:border-purple-700/50'
      : 'border-purple-100 bg-purple-50/40 hover:border-[#5500CC]/30'
  }`}>
    <div className={`p-2 rounded ${isDark ? 'bg-purple-900/20' : 'bg-purple-100/60'}`}>
      <Icon size={16} className={isDark ? 'text-purple-400' : 'text-[#5500CC]'} />
    </div>
    <div className="flex-1 min-w-0">
      <div className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={`text-sm font-medium flex items-center gap-1 transition-colors ${isDark ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-[#5500CC]'}`}>
          {value} <ExternalLink size={11} />
        </a>
      ) : (
        <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</div>
      )}
    </div>
  </div>
);

// ── Input styles ───────────────────────────────────────────────────────────────
const inputBase = (isDark) =>
  `w-full border p-4 rounded-lg bg-transparent text-sm transition-colors focus:outline-none focus:ring-2 ${
    isDark
      ? 'border-gray-700 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#5500CC] focus:ring-[#5500CC]/15'
  }`;

const ContactPage = () => {
  const { isDark } = useTheme();
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [isPolishing, setIsPolishing] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [sending, setSending]         = useState(false);
  const [sendError, setSendError]     = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const polishMessage = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setIsPolishing(true);
    const refined = await AIService.polishMessage(form.message);
    setForm(prev => ({ ...prev, message: refined }));
    setIsPolishing(false);
  };

  // EmailJS — submissions arrive as real emails in your inbox.
  // 1. Sign up at emailjs.com (free — 200 emails/month)
  // 2. Add Gmail as an Email Service → note the Service ID
  // 3. Create an Email Template with variables {{name}} {{email}} {{subject}} {{message}}
  // 4. Add these three values to Vercel env vars + local .env.local
  const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError(false);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          template_params: {
            name:    form.name,
            email:   form.email,
            subject: form.subject,
            message: form.message,
          },
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <SectionHeader title="Start a Project" subtitle="Tell us what you want to build. We'll make it happen." />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl border ${isDark ? 'bg-[#0d0b18]/60 border-purple-900/40' : 'bg-white border-purple-100 shadow-xl'}`}>

        {/* ── FORM ────────────────────────────────────────────────────────── */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Thanks for reaching out. We'll get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className={`mt-6 text-sm font-medium ${isDark ? 'text-purple-400' : 'text-[#5500CC]'} hover:underline`}>Send another</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your Name" required className={inputBase(isDark)} />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Your Email" required className={inputBase(isDark)} />
            </div>
            <input name="subject" value={form.subject} onChange={handleChange} type="text" placeholder="Subject" required className={inputBase(isDark)} />
            <textarea name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Tell us about your project..." required className={inputBase(isDark)} />

            {sendError && (
              <p className="text-xs text-red-400">Something went wrong — please email us directly.</p>
            )}

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={polishMessage}
                disabled={isPolishing || !form.message.trim()}
                className={`text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
              >
                {isPolishing ? 'Polishing...' : <><Sparkles size={12} /> AI Polish</>}
              </button>
              <Button type="submit" icon={Send} disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'}
              </Button>
            </div>

          </form>
        )}

        {/* ── INFO ─────────────────────────────────────────────────────────── */}
        <div className="space-y-4 flex flex-col">
          <div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-4 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>Contact Details</div>
            <div className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={APP_CONFIG.contactEmail} href={`mailto:${APP_CONFIG.contactEmail}`} isDark={isDark} />
              <InfoRow icon={MapPin} label="Location" value={APP_CONFIG.contactLocation} isDark={isDark} />
            </div>
          </div>

          <div className={`mt-auto p-5 rounded-xl border ${
            isDark ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50/60 border-purple-100'
          }`}>
            <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>What we build</div>
            <ul className="space-y-1.5">
              {[
                'Unity game development (mobile, PC, console)',
                'UEFN / Fortnite creative experiences',
                'WebGL & playable ad campaigns',
                'Firebase backend & multiplayer systems',
                'AR games & interactive brand activations',
              ].map(item => (
                <li key={item} className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className={`mt-0.5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>›</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
