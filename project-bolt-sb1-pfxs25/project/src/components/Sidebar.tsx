import React, { useState } from 'react';
import { Home, TrendingUp, Users, Radio, Compass, Heart, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LiveStream } from './LiveStream';
import { auth } from '../lib/firebase';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
  { icon: Compass, label: 'Recommended', path: '/recommended' },
  { icon: Radio, label: 'Go Live', path: '/live', isLiveButton: true },
  { icon: Users, label: 'Following', path: '/following' },
  { icon: Heart, label: 'Liked', path: '/liked' },
];

export function Sidebar() {
  const location = useLocation();
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const { user, isSidebarOpen } = useStore();
  
  const handleMenuClick = (item: any) => {
    if (item.isLiveButton) {
      setIsLiveStreamOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen w-[240px] bg-black text-white p-4 flex flex-col gap-2 z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:transform-none`}>
        <div className="mb-8">
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              TokClone
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item)}
              className={`flex items-center gap-4 p-4 w-full rounded-xl transition-all
                ${location.pathname === item.path
                  ? 'bg-white/10 text-white' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full rounded-xl text-red-400 hover:bg-white/5"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        )}
        
        <div className="border-t border-white/10 pt-4 text-sm text-gray-400">
          <p>© 2024 TokClone</p>
        </div>
      </aside>

      <LiveStream
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
      />
    </>
  );
}