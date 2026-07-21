import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <h2 className="text-xl font-bold tracking-wide">LeadCraft</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 focus:outline-none hover:bg-slate-800 rounded cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <nav className="hidden md:block w-64 bg-slate-900 text-white p-6 min-h-screen shrink-0">
        <h2 className="text-2xl font-bold mb-8 tracking-wide">LeadCraft</h2>
        
        <ul className="space-y-4 font-medium">
          <li>
            <Link to="/" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/leads" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
              All Leads
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeMenu}
          />
          <nav className="relative w-64 bg-slate-900 text-white p-6 min-h-screen shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-wide">LeadCraft</h2>
                <button onClick={closeMenu} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-4 font-medium">
                <li>
                  <Link onClick={closeMenu} to="/" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link onClick={closeMenu} to="/leads" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
                    All Leads
                  </Link>
                </li>
                <li>
                  <Link onClick={closeMenu} to="/settings" className="block py-2 px-4 rounded hover:bg-slate-800 transition-colors">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;