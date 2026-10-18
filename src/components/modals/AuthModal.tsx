import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/initialData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, currentUser, switchUser } = useApp();

  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    switchUser({
      id: `usr_${Date.now()}`,
      name: customName.trim(),
      email: customEmail.trim(),
      role: customRole.trim() || 'Researcher',
      institution: 'Academic Lab',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      cognitivePeakWindow: '09:00 – 12:30',
      termWeek: 'Term Wk 4',
      location: 'Thu, Oct 24 • Cambridge, UK',
    });

    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf9f5] w-full max-w-md rounded-2xl shadow-2xl border border-[#e6e2d8] flex flex-col overflow-hidden my-auto text-[#1b1c1a]">
        {/* Header */}
        <div className="p-4 border-b border-[#e6e2d8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#00685f]">
              account_circle
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#1b1c1a]">
              Workspace Authentication
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-[#6d7a77] hover:text-[#1b1c1a] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-xs font-semibold text-[#1b1c1a] block mb-2">
              Select an Active Academic Profile:
            </span>
            <div className="space-y-2">
              {MOCK_USERS.map((user) => {
                const isActive = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user);
                      closeAuthModal();
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      isActive
                        ? 'bg-[#89f5e7]/20 border-[#00685f] ring-1 ring-[#00685f]'
                        : 'bg-white border-[#e6e2d8] hover:bg-[#f5f3ef]'
                    }`}
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#1b1c1a] truncate">
                          {user.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono bg-[#00685f] text-white px-1.5 py-0.2 rounded font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6d7a77] truncate">{user.role}</p>
                      <p className="text-[10px] text-[#6d7a77] font-mono truncate">{user.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or Custom Sign In */}
          <div className="pt-2 border-t border-[#efeeea]">
            <span className="text-xs font-semibold text-[#1b1c1a] block mb-2">
              Or Sign In with Custom Credentials:
            </span>
            <form onSubmit={handleCustomLogin} className="space-y-2.5">
              <div>
                <input
                  type="text"
                  placeholder="Full Name (e.g., Dr. Jane Doe)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Institutional Email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-white text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Academic Focus / Role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-white text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white font-semibold shadow-xs transition-colors"
              >
                Sign In to DayFlow
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
