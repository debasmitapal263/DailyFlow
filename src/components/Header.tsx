import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentScreen,
    setCurrentScreen,
    closeTaskEditor,
    openAuthModal,
    activeIncident,
    lowEnergyMode,
    toggleLowEnergy,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);

  const screenNames: Record<string, string> = {
    today: 'Today',
    tasks: 'Tasks',
    dynamic: 'Dynamic',
    calendar: 'Calendar',
    weekly: 'Weekly Plan',
    analytics: 'Reports & Analytics',
    reports: 'Reports',
    drive: 'Cloud Backup',
    settings: 'Settings',
    task_editor: 'Task Editor',
  };

  const isTaskEditor = currentScreen === 'task_editor';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#fbf9f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e6e2d8]">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand or Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          {isTaskEditor ? (
            <button
              aria-label="Go back"
              onClick={closeTaskEditor}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#3d4947] hover:text-[#1b1c1a] hover:bg-[#eae8e4] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentScreen('today')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <img
                alt="DayFlow Logo"
                className="h-8 w-auto object-contain flex-shrink-0"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UMBtgD7gSuzlsy590Vqy2tHdQnDevpoAeO-eU4TAK7W9suR2he-_pK6Ohs5N3rLqtdPYfpoeQHK38Mip1vwxfUijxwiXDjpcPeZzH2q4Yl7KN0j5GxdbayBrTnz9_zzQjPHJp2P9bOasXtBNF-i-vYfqLkXLgqWMCEF9pqyOba_3yuL5hdLEAHS7LtkDptu_XSmqxKbt72b-1k7tozPpFi_LX-IMMDcdBAFd53gar7UR1FFl1cIhjA8w"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-semibold text-[#1b1c1a] tracking-tight group-hover:text-[#00685f] transition-colors">
                    DayFlow
                  </span>
                  <span className="hidden sm:inline-block text-[#6d7a77] text-[10px] font-mono">/</span>
                  <span className="hidden sm:inline-block text-xs text-[#3d4947] truncate">
                    {screenNames[currentScreen] || 'Dashboard'}
                  </span>
                </div>
                <span className="text-[11px] text-[#6d7a77] truncate">Intelligent Planner</span>
              </div>
            </button>
          )}

          {isTaskEditor && (
            <div className="flex flex-col min-w-0">
              <h1 className="text-[17px] font-semibold text-[#1b1c1a] truncate">Task Editor</h1>
              <span className="text-[11px] text-[#6d7a77] truncate">DayFlow Planner</span>
            </div>
          )}
        </div>

        {/* Right: Mode status & Profile switcher */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Energy / Focus State Pill */}
          <button
            onClick={toggleLowEnergy}
            title={lowEnergyMode ? 'Low energy protection active. Click to restore normal focus.' : 'High focus mode active. Click for low energy protection.'}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
              lowEnergyMode
                ? 'bg-[#ffebee] text-[#ba1a1a] border border-[#ffdad6]'
                : 'bg-[#89f5e7]/30 text-[#005049] border border-[#6bd8cb]/40 hover:bg-[#89f5e7]/50'
            }`}
          >
            <span>{lowEnergyMode ? '🌙 Low Energy' : '⚡ High Focus'}</span>
          </button>

          {/* Conflict Alert Icon if active incident */}
          {activeIncident && (
            <button
              onClick={() => setCurrentScreen('dynamic')}
              className="relative p-2 rounded-full text-[#ba1a1a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] transition-colors"
              title="Active schedule overlap detected! Click to rebalance."
            >
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
            </button>
          )}

          {/* User Profile Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full ring-2 ring-[#e6e2d8] hover:ring-[#00685f] transition-all overflow-hidden flex items-center justify-center bg-[#eae8e4]"
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <img
                alt={currentUser.name}
                className="w-full h-full object-cover"
                src={currentUser.avatarUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-[#e6e2d8] p-3 z-50 text-left">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#e6e2d8]">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1b1c1a] truncate">{currentUser.name}</p>
                      <p className="text-xs text-[#6d7a77] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] bg-[#efeeea] text-[#3d4947] px-1.5 py-0.5 rounded">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#3d4947] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">switch_account</span>
                      <span>Switch Profile or Log In</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setCurrentScreen('settings');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#3d4947] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">settings</span>
                      <span>Planner Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setCurrentScreen('drive');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#3d4947] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                      <span>Google Drive Sync</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
