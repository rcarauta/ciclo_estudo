import React from 'react';
import { Bell, Timer, Search } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-surface/60 backdrop-blur-md flex justify-between items-center px-8 w-auto">
      <div className="flex items-center gap-8">
        <span className="text-xl font-extrabold text-primary font-headline">Study Curator</span>
        <nav className="hidden md:flex gap-6">
          <button className="text-primary border-b-2 border-primary font-medium text-sm py-5">My Progress</button>
          <button className="text-secondary hover:text-primary font-medium text-sm py-5 transition-opacity">Materials</button>
          <button className="text-secondary hover:text-primary font-medium text-sm py-5 transition-opacity">Community</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-sm w-48 focus:ring-2 focus:ring-primary-container transition-all"
          />
          <Search size={14} className="absolute right-3 top-2 text-on-surface-variant" />
        </div>
        
        <div className="relative group">
          <Bell size={20} className="text-secondary cursor-pointer hover:text-primary transition-colors" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></div>
        </div>
        
        <Timer size={20} className="text-secondary cursor-pointer hover:text-primary transition-colors" />
        
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight">Alex Rivera</p>
            <p className="text-[10px] text-secondary font-medium tracking-tighter uppercase">Level 42 Academic</p>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHvlyN5BuShpYSQdJeYzyRyPMCPsUFHAIwKW9LSQ2TUtA0qc-1I3hTCl-2UMWcySZ0zSAbe0B9fr9eF6osoHCbTOLA8Xx9AbIU02f_HXKSdx60Lxc7NyJbv7gqB5v48qsv_q1a-KUAm8SK00YcBn34GH9ArNULLNN5YFzwKx9SJuIzJPNMtwofgPAnOqhqW5tWVifW3M0WeKfYaz-9Aq4aEwLAHAFG-LP9Xs2A5JeWClY0XD1fpW0Fp80mjfhooCI8BwB_N0x5zKPP" 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
