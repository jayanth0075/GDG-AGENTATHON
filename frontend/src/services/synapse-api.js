import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// System Status
export const getSystemStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

// AI Query / Chat (CORE FEATURE)
export const queryAI = async (query, top_k = 5) => {
  const response = await api.post('/query_ai', {
    query,
    top_k
  });
  return response.data;
};

// Daily Summary
export const getDailySummary = async () => {
  const response = await api.post('/query_ai', {
    query: "What were today's key company updates?",
    top_k: 10
  });
  return response.data;
};

// Memory Dump (Debug/Explorer)
export const getMemoryDump = async () => {
  const response = await api.get('/dump');
  return response.data;
};

// Knowledge Graph (Neo4j visualization)
export const getKnowledgeGraph = async () => {
  try {
    const response = await api.get('/graph');
    return response.data;
  } catch (err) {
    console.warn('Graph endpoint not available, returning mock data');
    return generateMockGraphData();
  }
};

// Vector Database Statistics (Semantic Intelligence)
export const getVectorStats = async () => {
  try {
    const response = await api.get('/vector_stats');
    return response.data;
  } catch (err) {
    console.warn('Vector stats endpoint not available, returning mock data');
    return generateMockVectorStats();
  }
};

// Mock data generators for demo purposes
const generateMockGraphData = () => ({
  nodes: [
    { id: '1', label: 'Company', type: 'entity', size: 40 },
    { id: '2', label: 'Finance', type: 'department', size: 30 },
    { id: '3', label: 'Engineering', type: 'department', size: 30 },
    { id: '4', label: 'Q4 Budget', type: 'project', size: 25 },
    { id: '5', label: 'Cloud Migration', type: 'project', size: 25 },
    { id: '6', label: 'Software Licenses', type: 'expense', size: 20 },
    { id: '7', label: 'Infrastructure', type: 'expense', size: 20 },
  ],
  edges: [
    { source: '1', target: '2', label: 'has_department' },
    { source: '1', target: '3', label: 'has_department' },
    { source: '2', target: '4', label: 'manages' },
    { source: '3', target: '5', label: 'owns' },
    { source: '4', target: '6', label: 'includes_cost' },
    { source: '5', target: '7', label: 'requires' },
  ]
});

const generateMockVectorStats = () => ({
  totalEmbeddings: 1247,
  averageSimilarity: 0.72,
  clusterCount: 8,
  topTopics: [
    { name: 'Finance & Budgets', count: 245, similarity: 0.85 },
    { name: 'Engineering Projects', count: 198, similarity: 0.78 },
    { name: 'HR & Hiring', count: 156, similarity: 0.81 },
    { name: 'Operations', count: 142, similarity: 0.74 },
    { name: 'Marketing & Branding', count: 128, similarity: 0.79 },
  ],
  dimensionality: 384,
  indexSize: '2.4 GB'
});

export default api;
