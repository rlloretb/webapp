import React from 'react';

function Sidebar({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'solver', label: 'Solver', icon: '⚙️' },
    { id: 'history', label: 'History', icon: '📋' },
  ];

  return (
    <nav className="w-64 bg-white border-r border-secondary-200 shadow-md-custom flex flex-col p-6 animate-slide-in">
      <div className="space-y-6 flex-1">
        <div>
          <div className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ' +
                  (currentPage === item.id
                    ? 'bg-primary text-white shadow-md-custom'
                    : 'text-secondary-700 hover:bg-secondary-50 hover:text-primary')
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
