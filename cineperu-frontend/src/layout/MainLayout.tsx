import React from 'react';
import MainHeader from '../components/MainHeader';


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f10] text-white">
      <MainHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-12 pb-8 sm:py-16" style={{minHeight:'70vh'}}>
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
