import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Utensils, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/bookings', label: 'Bookings', icon: Utensils },
    { path: '/settings', label: 'Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-headline font-extrabold tracking-tighter text-primary">
            TableNow
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm font-medium text-on-surface-variant">
                  {profile?.displayName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <LogOut className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-bold text-primary hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-24 sm:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg border-t border-surface-container z-50 px-4 py-2 flex justify-around items-center rounded-t-3xl shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {item.label}
              </span >
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar/Footer (Optional) */}
      <footer className="hidden sm:block w-full py-12 px-8 bg-surface-container-low mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="font-headline font-bold text-xl text-on-surface">TableNow</span>
            <p className="text-on-surface-variant text-sm mt-2">© 2026 TableNow. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
