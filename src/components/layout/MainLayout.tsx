import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { TrustBar } from './TrustBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <TrustBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
