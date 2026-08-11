import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Loader2
} from 'lucide-react';

interface AiAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  datasetContext: any;
}

export const AiAnalystDrawer: React.FC<AiAnalystDrawerProps> = ({
  isOpen,
  onClose,
  datasetContext
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Data Analyst assistant for the India Road Accident Analytics Project. Ask me to formulate custom MySQL queries, generate Power BI DAX measures, explain Python EDA statistical models, or suggest MoRTH road safety policy recommendations!'
    }
  ]);

  const presetPrompts = [
    'Write a MySQL query to find top 3 accident districts per state using PARTITION BY.',
    'Give me a DAX formula for a 30-day moving average of road fatalities.',
    'Explain the Seaborn correlation heatmap findings for over-speeding vs evening peak hours.',
    'Draft a 3-point policy proposal for NHAI highway blackspot lighting.'
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: datasetContext
        })
      });

      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, failed to connect to the AI Analyst service. Please check your network or API key configuration.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-sm bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
                <span>AI Data Analyst Assistant</span>
                <Sparkles className="w-3 h-3 text-blue-400" />
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">POWERED BY GEMINI 2.5 FLASH</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-sm bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-1.5">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
            Suggested Queries:
          </span>
          <div className="flex space-x-2 overflow-x-auto pb-1 text-xs">
            {presetPrompts.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(preset)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-sm border border-slate-800 whitespace-nowrap transition-colors font-mono"
              >
                {preset.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 font-sans'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic bg-slate-950 p-3 rounded-sm border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing road safety parameters and executing AI query...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Box */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Ask AI for custom SQL, DAX, Python EDA or policy advice..."
            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={loading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-sm transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

