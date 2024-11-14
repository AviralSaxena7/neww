import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { ProductPage } from './components/ProductPage';
import { UserProfile } from './components/UserProfile';
import { useStore } from './store/useStore';
import { seedDatabase } from './lib/seedData';

export function App() {
  const isSidebarOpen = useStore(state => state.isSidebarOpen);

  useEffect(() => {
    // Uncomment this line to seed the database (only run once)
    // seedDatabase();
  }, []);

  return (
    <Router>
      <div className="flex bg-black min-h-screen">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[240px]' : 'ml-0'
        } sm:ml-0`}>
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/user/:userId" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}