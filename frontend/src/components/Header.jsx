import React from 'react';

function Header() {
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
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-white text-sm font-medium">System Ready</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
