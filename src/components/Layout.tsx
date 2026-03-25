import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Timer from './Timer';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/20 selection:text-primary">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <TopBar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
      <Timer />
    </div>
  );
}
