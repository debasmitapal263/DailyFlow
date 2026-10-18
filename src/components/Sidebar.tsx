import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    currentUser,
    openAuthModal,
    activeIncident,
    pacingMode,
    setPacingMode,
    lowEnergyMode,
    toggleLowEnergy,
    setShowOnboarding,
  } = useApp();

  const navItems = [
    { id: 'today', label: "Today's Flow Stream", icon: 'view_timeline' },
    { id: 'tasks', label: 'Tasks & Backlog', icon: 'checklist' },
    { id: 'calendar', label: 'Interactive Calendar', icon: 'calendar_month' },
    { id: 'weekly', label: 'Weekly Planning', icon: 'date_range' },
    {
      id: 'dynamic',
      label: 'Dynamic Rebalance',
      icon: 'tune',
      badge: activeIncident ? '1 Alert' : undefined,
    },
    { id: 'analytics', label: 'Reports & Analytics', icon: 'analytics' },
    { id: 'drive', label: 'Google Drive Sync', icon: 'cloud_upload' },
    { id: 'settings', label: 'Planner Settings', icon: 'settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#fbf9f5] border-r border-[#e6e2d8] fixed top-16 bottom-0 left-0 z-30 select-none overflow-y-auto no-scrollbar p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#6d7a77] uppercase">
            Workspaces
          </div>
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#00685f] text-white shadow-sm'
                    : 'text-[#3d4947] hover:bg-[#eae8e4] hover:text-[#1b1c1a]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      isActive ? 'text-white' : 'text-[#00685f]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-semibold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pacing & Recovery Mode Card */}
        <div className="p-3 rounded-xl bg-white border border-[#e6e2d8] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1b1c1a]">Pacing Mode</span>
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">speed</span>
          </div>

          <div className="grid grid-cols-2 p-1 bg-[#efeeea] rounded-lg gap-1 text-[11px]">
            <button
              onClick={() => setPacingMode('balanced')}
              className={`py-1.5 rounded-md text-center transition-all ${
                pacingMode === 'balanced'
                  ? 'bg-white text-[#00685f] font-semibold shadow-xs'
                  : 'text-[#3d4947] hover:text-[#1b1c1a]'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => setPacingMode('deadline')}
              className={`py-1.5 rounded-md text-center transition-all ${
                pacingMode === 'deadline'
                  ? 'bg-white text-[#00685f] font-semibold shadow-xs'
                  : 'text-[#3d4947] hover:text-[#1b1c1a]'
              }`}
            >
              Deadline
            </button>
          </div>

          {/* Low Energy Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-[#efeeea]">
            <div className="pr-2">
              <span className="text-[11px] font-medium text-[#1b1c1a] block">Low-Energy Mode</span>
              <span className="text-[10px] text-[#6d7a77] block leading-tight">Downgrades deep blocks</span>
            </div>
            <button
              onClick={toggleLowEnergy}
              className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                lowEnergyMode ? 'bg-[#00685f]' : 'bg-[#e4e2de]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                  lowEnergyMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer User card & Onboarding shortcut */}
      <div className="pt-4 border-t border-[#e6e2d8] space-y-3">
        <button
          onClick={() => setShowOnboarding(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#e6e2d8] text-xs text-[#3d4947] hover:bg-[#eae8e4] hover:text-[#1b1c1a] transition-colors"
        >
          <span className="material-symbols-outlined text-[15px] text-[#00685f]">auto_awesome</span>
          <span>First-Time Setup Wizard</span>
        </button>

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#e6e2d8]">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-[#1b1c1a] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#6d7a77] truncate">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={openAuthModal}
            className="p-1 rounded-md text-[#6d7a77] hover:text-[#1b1c1a] hover:bg-[#efeeea]"
            title="Switch User Profile"
          >
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
