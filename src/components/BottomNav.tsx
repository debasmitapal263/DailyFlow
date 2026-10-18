import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeIncident } = useApp();

  const navItems = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'tasks', label: 'Tasks', icon: 'check_circle' },
    { id: 'dynamic', label: 'Dynamic', icon: 'tune', badge: !!activeIncident },
    { id: 'analytics', label: 'Reports', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#fbf9f5]/92 backdrop-blur-xl border-t border-[#e6e2d8] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] md:hidden">
      <div className="flex justify-between items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`relative flex flex-1 flex-col items-center justify-center min-w-0 h-14 min-h-[44px] transition-all gap-1 ${
                isActive ? 'text-[#00685f] font-semibold' : 'text-[#3d4947] hover:text-[#1b1c1a]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ba1a1a]" />
                )}
              </div>
              <span className="text-[11px] truncate tracking-tight">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-4 h-0.5 bg-[#00685f] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
