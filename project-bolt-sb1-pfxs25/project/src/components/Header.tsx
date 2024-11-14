import React, { useState } from 'react';
import { Search, Bell, User, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AuthModal } from './AuthModal';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const user = useStore(state => state.user);

  return (
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-between gap-4 border-b border-white/10 sm:left-0">
      <div className="w-48 px-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-purple-500" size={24} />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ShopHub
          </span>
        </div>
      </div>
      
      <div className="flex-1 max-w-xl mx-auto px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex items-center gap-4 px-4">
        <button className="relative p-2 hover:bg-white/10 rounded-full">
          <Bell size={20} className="text-white" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 bg-white/10 rounded-full p-1.5 pr-4 hover:bg-white/20"
        >
          {user ? (
            <>
              <img
                src={user.photoURL}
                alt={user.username}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-white text-sm hidden sm:block">
                {user.username}
              </span>
            </>
          ) : (
            <>
              <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white text-sm hidden sm:block">Login</span>
            </>
          )}
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}