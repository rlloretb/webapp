import React, { useState, useEffect } from 'react';

function Header() {
  const [systemStatus, setSystemStatus] = useState({ online: false, checking: true });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/health', { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        const data = await response.json();
        setSystemStatus({ 
          online: response.ok && data.status === 'ok', 
          checking: false 
        });
      } catch (error) {
        setSystemStatus({ online: false, checking: false });
      }
    };

    // Check immediately
    checkHealth();

    // Then check every 15 seconds
    const interval = setInterval(checkHealth, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusDisplay = () => {
    if (systemStatus.checking) {
      return {
        color: 'bg-yellow-400',
        text: 'Checking...',
        pulseColor: 'bg-yellow-400'
      };
    }
    if (systemStatus.online) {
      return {
        color: 'bg-success',
        text: 'System Online',
        pulseColor: 'bg-success'
      };
    }
    return {
      color: 'bg-red-500',
      text: 'System Offline',
      pulseColor: 'bg-red-500'
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="bg-gradient-primary shadow-lg-custom sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Berth Scheduling Optimizer</h1>
            <p className="text-blue-100 text-sm">Minimize vessel port makespan efficiently</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg border border-white border-opacity-20">
          <span className="relative flex h-3 w-3">
            {systemStatus.online && (
              <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${status.pulseColor} opacity-75`}></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${status.color}`}></span>
          </span>
          <span className="text-white text-sm font-medium">{status.text}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
