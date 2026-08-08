import React from 'react';
import { Camera, Code2, Settings, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isModelLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isModelLoaded }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'simulator', label: 'Live Webcam Simulator', icon: <Camera className="w-4 h-4" /> },
    { id: 'code', label: 'Python Code & Script', icon: <Code2 className="w-4 h-4" /> },
    { id: 'configurator', label: 'Script Configurator', icon: <Settings className="w-4 h-4" /> },
    { id: 'setup', label: 'Installation & Setup Guide', icon: <Terminal className="w-4 h-4" /> },
    { id: 'tester', label: 'Photo Match Tester', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Face Recognition Studio
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Python CV v2.4
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                OpenCV + dlib / face_recognition real-time engineering suite
              </p>
            </div>
          </div>

          {/* Model status indicator */}
          <div className="hidden md:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isModelLoaded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isModelLoaded ? 'Vision AI Engine Ready' : 'Initializing Models...'}</span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-2 scrollbar-none border-t border-slate-800/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-300 bg-slate-800/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
