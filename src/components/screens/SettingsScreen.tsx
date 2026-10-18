import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const {
    categories,
    pacingMode,
    setPacingMode,
    lowEnergyMode,
    toggleLowEnergy,
    setShowOnboarding,
    addRealtimeMessage,
  } = useApp();

  const [wakeTime, setWakeTime] = useState('06:00 AM');
  const [bedTime, setBedTime] = useState('11:00 PM');
  const [bufferPercent, setBufferPercent] = useState('15%');
  const [breakFrequency, setBreakFrequency] = useState('Every 90 mins');

  const handleResetData = () => {
    if (confirm('Reset DayFlow sample data back to initial defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
          Planner Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-[#3d4947]">
          Calibrate anchor schedules, category targets, buffer rules, and cognitive load thresholds.
        </p>
      </div>

      {/* Section 1: Categories Manager */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f] text-[20px]">category</span>
            <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
              Domain Categories & Targets
            </h2>
          </div>
          <span className="font-mono text-xs text-[#6d7a77]">{categories.length} Active</span>
        </div>

        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="font-semibold text-[#1b1c1a] truncate">{c.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-[#6d7a77] bg-white px-2 py-0.5 rounded border border-[#e6e2d8]">
                  {c.targetHoursPerWeek}h/wk
                </span>
                <span className="capitalize font-mono text-[10px] text-[#00685f]">
                  {c.flexibility}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Daily Anchor Times */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0051d5] text-[20px]">schedule</span>
          <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
            Circadian Anchors & Availability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3d4947]">Weekday Wake Time</label>
            <input
              type="text"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3d4947]">Target Wind-down & Bedtime</label>
            <input
              type="text"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3d4947]">Buffer Time Reservation</label>
            <input
              type="text"
              value={bufferPercent}
              onChange={(e) => setBufferPercent(e.target.value)}
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#3d4947]">Preferred Break Rhythm</label>
            <input
              type="text"
              value={breakFrequency}
              onChange={(e) => setBreakFrequency(e.target.value)}
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] font-mono focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Pacing & Reset */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">Onboarding & Reset</h2>
            <p className="text-xs text-[#6d7a77]">Revisit setup wizard or reset all locally stored state.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => setShowOnboarding(true)}
            className="px-4 py-2.5 bg-[#efeeea] hover:bg-[#eae8e4] text-[#1b1c1a] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">auto_awesome</span>
            <span>Relaunch Setup Wizard</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 bg-white hover:bg-[#ffdad6]/20 border border-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Demo Data to Initial</span>
          </button>
        </div>
      </section>
    </div>
  );
};
