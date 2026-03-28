import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeEvent, generatePlan, generateEmails, estimateBudget } from '../api/ai.api';
import { Zap, Send, ArrowLeft, Check, Loader2, Sparkles, Bot, User } from 'lucide-react';

const CONFIRM_KEYWORDS = ['yes', 'correct', 'good', 'looks right', 'fine', 'ok', 'proceed', 'confirm', 'perfect', 'great', 'sure', 'go ahead', 'looks good'];

export default function BuilderPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Welcome! I'm your AI event planning assistant. 🎉\n\nDescribe your event in one sentence, and I'll create a complete plan — tasks, budget, email drafts, and a live event page.\n\nFor example: *\"Plan a 300-person cultural festival in Hyderabad on April 20th, budget ₹50,000, theme Rajasthani Folk\"*",
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('idle'); // idle, initializing, confirming, generating, done
  const [eventData, setEventData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, progress]);

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg, type: 'text' });

    if (phase === 'idle' || phase === 'confirming') {
      // Check if this is a confirmation (only when confirming)
      if (phase === 'confirming') {
        const isConfirm = CONFIRM_KEYWORDS.some(kw => userMsg.toLowerCase().includes(kw));
        if (isConfirm) {
          await startGeneration();
          return;
        }
        // Otherwise treat as a correction — re-initialize
      }

      // Initialize event
      setPhase('initializing');
      setIsTyping(true);
      try {
        const res = await initializeEvent(userMsg);
        const event = res.data.event;
        setEventData(event);
        setIsTyping(false);

        const summary = `Great! Here's what I've captured:\n\n• **Name:** ${event.name}\n• **Type:** ${event.type}\n• **Date:** ${new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}\n• **Location:** ${event.location || 'TBD'}, ${event.city}\n• **Audience:** ${event.audience} people\n• **Budget:** ₹${event.budget?.toLocaleString('en-IN')}\n• **Theme:** ${event.theme || 'Not specified'}\n\nDoes this look right? Say **"Looks good!"** to proceed, or tell me what to change.`;

        addMessage({ role: 'ai', content: summary, type: 'summary' });
        setPhase('confirming');
      } catch (err) {
        setIsTyping(false);
        addMessage({ role: 'ai', content: '❌ ' + (err.response?.data?.message || 'Something went wrong. Please try again.'), type: 'text' });
        setPhase('idle');
      }
    }
  };

  const startGeneration = async () => {
    setPhase('generating');
    setIsTyping(true);
    addMessage({ role: 'ai', content: '🚀 Generating your complete event plan...', type: 'text' });
    setIsTyping(false);

    const steps = [
      { label: 'Creating task checklist...', fn: () => generatePlan(eventData._id), done: 'Tasks created' },
      { label: 'Drafting emails...', fn: () => generateEmails(eventData._id), done: 'Email drafts ready' },
      { label: 'Estimating budget...', fn: () => estimateBudget(eventData._id), done: 'Budget estimated' }
    ];

    const progressItems = [];
    for (const step of steps) {
      progressItems.push({ label: step.label, status: 'loading' });
      setProgress([...progressItems]);

      try {
        await step.fn();
        progressItems[progressItems.length - 1] = { label: step.done, status: 'done' };
        setProgress([...progressItems]);
      } catch (err) {
        progressItems[progressItems.length - 1] = { label: `Failed: ${step.label}`, status: 'error' };
        setProgress([...progressItems]);
      }
    }

    addMessage({
      role: 'ai',
      content: '✅ Your event plan is ready! Click below to view your dashboard.',
      type: 'text'
    });
    setPhase('done');
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => {
      // Bold
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Bullet points
      if (formatted.startsWith('• ')) {
        return <div key={i} className="ml-2 flex gap-2"><span className="text-purple-400">•</span><span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} /></div>;
      }
      return <div key={i} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">EventOS <span className="text-gray-400 font-normal text-sm">Builder</span></span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'glass-card text-gray-200 rounded-bl-md'
              }`}>
                <div className="text-sm leading-relaxed space-y-1">
                  {formatContent(msg.content)}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}

          {/* Progress steps */}
          {progress.length > 0 && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-5 py-4 space-y-3">
                {progress.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {p.status === 'loading' ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : p.status === 'done' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="w-4 h-4 text-red-400">✗</span>
                    )}
                    <span className={p.status === 'done' ? 'text-green-300' : p.status === 'error' ? 'text-red-300' : 'text-gray-300'}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard CTA */}
          {phase === 'done' && eventData && (
            <div className="flex justify-center pt-4 animate-slide-up">
              <button
                onClick={() => navigate(`/dashboard/${eventData._id}`)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-2xl hover:shadow-purple-500/30"
              >
                View Your Dashboard
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {phase !== 'done' && (
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  phase === 'confirming' ? 'Say "Looks good!" to proceed or describe changes...'
                    : phase === 'generating' ? 'Generating your event plan...'
                    : 'Describe your event in one sentence...'
                }
                disabled={phase === 'generating' || isTyping}
                className="flex-1 px-5 py-3.5 rounded-xl bg-gray-800/80 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || phase === 'generating' || isTyping}
                className="px-5 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-30"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
