import { useState, useEffect, useRef } from 'react';
import { Send, Loader, FileText, Zap } from 'lucide-react';
import { queryAI } from '../services/synapse-api';

export default function AIChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await queryAI(query, 5);
      const assistantMessage = {
        role: 'assistant',
        content: response.summary,
        sources: response.top_matches || []
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Query failed:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask Synapse</h1>
        <p className="text-gray-600">Query your organizational memory with AI-powered intelligence</p>
      </div>

      {/* Chat Container */}
      <div className="glass-card rounded-2xl p-6 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-500 text-lg mb-4">Start asking questions about your company data</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Summarize recent expenses',
                    'What were today\'s updates?',
                    'Latest project status',
                    'Finance summary'
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(suggestion);
                        setTimeout(() => {
                          const form = document.querySelector('form');
                          if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                        }, 100);
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-700 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : msg.error
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'glass-card'
                }`}>
                  <p className={msg.role === 'user' ? 'text-white' : 'text-gray-900'}>{msg.content}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-3">SOURCE DOCUMENTS ({msg.sources.length})</p>
                      <div className="space-y-2">
                        {msg.sources.map((source, i) => (
                          <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                            <FileText size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{source.preview}</p>
                              <p className="text-xs text-gray-500">From: {source.metadata?.source || 'Unknown'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-2">
                <Loader size={16} className="animate-spin text-gray-600" />
                <span className="text-gray-600">Synapse is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your company data..."
            disabled={loading}
            className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
