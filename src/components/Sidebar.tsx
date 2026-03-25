import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  BarChart3, 
  RotateCw, 
  ClipboardCheck, 
  Settings, 
  HelpCircle,
  Play,
  Timer
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { View } from '@/src/types';
import { useStudy } from '../StudyContext';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { activeSession } = useStudy();
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'edital' as View, label: 'Edital Vertical', icon: Network },
    { id: 'performance' as View, label: 'Performance', icon: BarChart3 },
    { id: 'cycle' as View, label: 'Study Cycle', icon: RotateCw },
    { id: 'mock-tests' as View, label: 'Mock Tests', icon: ClipboardCheck },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-black text-primary tracking-tight font-headline">Focused Curator</h1>
        <p className="text-xs font-medium text-secondary uppercase tracking-widest mt-1">Exam Prep Mode</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 transition-all duration-200",
              currentView === item.id 
                ? "text-primary font-bold border-l-4 border-surface-tint bg-surface-container-lowest" 
                : "text-on-surface-variant font-medium hover:bg-surface-container-high"
            )}
          >
            <item.icon size={20} />
            <span className="tracking-[0.05em] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <button 
          onClick={() => onViewChange('edital')}
          className={cn(
            "w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2",
            activeSession 
              ? "bg-orange-500 text-white shadow-orange-500/20" 
              : "bg-gradient-to-b from-primary to-primary-container text-white shadow-primary/20"
          )}
        >
          {activeSession ? (
            <>
              <Timer size={18} className="animate-pulse" />
              Session Active
            </>
          ) : (
            <>
              <Play size={18} />
              Start Session
            </>
          )}
        </button>
        <div className="pt-6 border-t border-outline-variant/20 space-y-1">
          <button 
            onClick={() => onViewChange('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-2 py-2 transition-colors",
              currentView === 'settings' ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary"
            )}
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
          <button 
            onClick={() => onViewChange('support')}
            className={cn(
              "w-full flex items-center gap-3 px-2 py-2 transition-colors",
              currentView === 'support' ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary"
            )}
          >
            <HelpCircle size={18} />
            <span className="text-sm">Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
