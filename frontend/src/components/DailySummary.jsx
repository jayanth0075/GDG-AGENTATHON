import { useState, useEffect } from 'react';
import { Calendar, Loader2, RefreshCw, FileText, Zap } from 'lucide-react';
import { getDailySummary } from '../services/synapse-api';

export default function DailySummary() {
  const [summary, setSummary] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await getDailySummary();
      setSummary(data.summary || '');
      setSources(data.top_matches || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load daily summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 size={48} className="animate-spin text-blue-500" />
        <p className="text-gray-600">Generating today's summary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Daily Summary</h1>
          <p className="text-gray-600 mt-2">Key updates from today's documents and communications</p>
        </div>
        <button
          onClick={loadSummary}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card border-l-4 border-red-500 p-6 bg-red-50/50">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Summary Content */}
      {summary && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Summary Card */}
          <div className="glass-card rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Today's Updates</h2>
                {lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Generated {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>

          {/* Source Documents */}
          {sources && sources.length > 0 && (
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Source Documents ({sources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                    style={{ animation: `slideInLeft 0.5s ease-out ${100 + idx * 100}ms both` }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="text-gray-500 flex-shrink-0 mt-1" size={16} />
                      <div className="flex-1">
                        {doc.metadata?.source && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                            {doc.metadata.source}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {doc.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

