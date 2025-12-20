import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Analytics from './components/Analytics';
import DailySummary from './components/DailySummary';
import KnowledgeExplorer from './components/KnowledgeExplorer';
import Team from './components/Team';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const handleNavigate = (e) => {
      setCurrentView(e.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <AIChat />;
      case 'analytics':
        return <Analytics />;
      case 'summary':
        return <DailySummary />;
      case 'explorer':
        return <KnowledgeExplorer />;
      case 'team':
        return <Team />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen app-background">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;
