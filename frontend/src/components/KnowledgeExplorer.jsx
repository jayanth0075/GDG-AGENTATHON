import { useState, useEffect } from 'react';
import { Search, FileText, Mail, File, Loader2, Database } from 'lucide-react';
import { getMemoryDump } from '../services/synapse-api';

export default function KnowledgeExplorer() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getMemoryDump();
      setDocuments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load knowledge base');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.preview?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.metadata?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.metadata?.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceIcon = (metadata) => {
    if (metadata?.type === 'google_doc' || metadata?.source === 'docs') {
      return <FileText size={20} className="text-blue-500" />;
    }
    if (metadata?.type === 'gmail' || metadata?.source === 'mail') {
      return <Mail size={20} className="text-red-500" />;
    }
    if (metadata?.type === 'google_sheet' || metadata?.source === 'sheets') {
      return <File size={20} className="text-green-500" />;
    }
    return <File size={20} className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 size={48} className="animate-spin text-blue-500" />
        <p className="text-gray-600">Loading knowledge base...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Memory Explorer</h1>
        <p className="text-gray-600 mt-2">Browse all indexed documents and data sources</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {documents.filter(d => d.metadata?.source?.includes('doc')).length}
              </p>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {documents.filter(d => d.metadata?.source?.includes('mail')).length}
              </p>
              <p className="text-sm text-gray-600">Emails</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card border-l-4 border-red-500 p-6 bg-red-50/50">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all"
            style={{ animation: `slideInLeft 0.5s ease-out ${100 + index * 50}ms both` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-1">
                {getSourceIcon(doc.metadata)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {doc.metadata?.title || doc.id || 'Untitled'}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {doc.metadata?.source && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                  {doc.metadata.source}
                </span>
              )}
              {doc.metadata?.type && (
                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                  {doc.metadata.type}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 line-clamp-3">
              {doc.preview || 'No preview available'}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && !loading && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Database size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No documents match your search' : 'No documents found in knowledge base'}
          </p>
        </div>
      )}
    </div>
  );
}

