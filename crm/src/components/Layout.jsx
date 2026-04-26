import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const EXPANDED_W = 265;
const COLLAPSED_W = 75;

export default function Layout({ children }) {
  const { sidebarOpen } = useSelector(s => s.ui);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-inter">
      <Sidebar />
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? EXPANDED_W : COLLAPSED_W }}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
