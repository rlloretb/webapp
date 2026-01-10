import React, { useState, useEffect } from 'react';
import './tailwind.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Solver from './pages/Solver';
import History from './pages/History';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    // Load solutions from API
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await fetch('/solutions?limit=100');
      const data = await response.json();
      setSolutions(data.solutions || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleSolutionSaved = (newSolution) => {
    setSolutions([newSolution, ...solutions]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard solutions={solutions} />;
      case 'solver':
        return <Solver onSolutionSaved={handleSolutionSaved} />;
      case 'history':
        return <History solutions={solutions} />;
      default:
        return <Dashboard solutions={solutions} />;
    }
  };

  return (
    <div className="app flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="app-layout flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
