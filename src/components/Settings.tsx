import React from 'react';
import { useStudy } from '../StudyContext';
import { Trash2, Download, Shield, Bell, User } from 'lucide-react';

export default function Settings() {
  const { clearAllData } = useStudy();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black text-on-surface font-headline tracking-tight">Settings</h1>
        <p className="text-on-surface-variant font-medium mt-2">Manage your preferences and data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold font-headline text-on-surface">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container-high rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">User Profile</p>
                <p className="text-xs text-on-surface-variant">Manage your personal information</p>
              </div>
              <button className="px-4 py-2 bg-surface-container-lowest text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">Edit</button>
            </div>
            <div className="p-4 bg-surface-container-high rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">Notifications</p>
                <p className="text-xs text-on-surface-variant">Stay updated on your progress</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold font-headline text-on-surface">Data & Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-container-high rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">Export Data</p>
                <p className="text-xs text-on-surface-variant">Download your study progress as JSON</p>
              </div>
              <button className="p-2 bg-surface-container-lowest text-on-surface-variant rounded-xl hover:text-primary transition-colors">
                <Download size={20} />
              </button>
            </div>
            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-600">Clear All Data</p>
                <p className="text-xs text-red-500/70">Permanently delete all your study history</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    clearAllData();
                  }
                }}
                className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
