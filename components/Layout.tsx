import React from 'react';
import { Plane, Plus, Home, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
                <Plane size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Wanderlust
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
                 <Link to="/about" className={`text-sm font-medium ${isActive('/about') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>About</Link>
                 <Link to="/contact" className={`text-sm font-medium ${isActive('/contact') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`p-2 rounded-md transition-all ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                    title="Dashboard"
                  >
                    <Home size={20} />
                  </Link>
                  <Link 
                    to="/create" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">New Trip</span>
                  </Link>
                  <div className="h-6 w-px bg-slate-200 mx-1"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  <LogIn size={16} />
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {/* We remove max-w restriction here to allow landing page to be full width, layout restrictions handle in pages if needed */}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Wanderlust Planner. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
               <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
               <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};