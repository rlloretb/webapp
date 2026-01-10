import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-secondary-200 bg-secondary-50 px-6 py-4 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-sm text-secondary-600">© {currentYear} Berth Scheduling Optimizer. All rights reserved.</p>
        <div className="text-xs text-secondary-500 flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
