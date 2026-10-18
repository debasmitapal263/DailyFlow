import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FocusSessionModal: React.FC = () => {
  const {
    isFocusModalOpen,
    closeFocusModal,
    activeFocusTask,
    focusElapsedSeconds,
    focusIsPaused,
    toggleFocusPause,
    stopFocusSession,
  } = useApp();

  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionOutcome, setSessionOutcome] = useState('completed_planned');

  if (!isFocusModalOpen || !activeFocusTask) return null;

  const totalSeconds = activeFocusTask.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - focusElapsedSeconds);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    stopFocusSession();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf9f5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#e6e2d8] flex flex-col max-h-[92vh] overflow-hidden my-auto text-[#1b1c1a]">
        {/* Top Bar */}
        <div className="p-4 border-b border-[#e6e2d8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] animate-pulse" />
            <span className="font-mono text-xs text-[#00685f] font-bold uppercase tracking-wider">
              Active Focus Chamber
            </span>
          </div>

          <button
            onClick={closeFocusModal}
            className="text-[#6d7a77] hover:text-[#1b1c1a] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Timer Hero View */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-white to-[#f5f3ef]">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-mono">
            {activeFocusTask.categoryId.toUpperCase()} • DEEP WORK
          </span>

          <h2 className="text-lg sm:text-xl font-bold max-w-md tracking-tight">
            {activeFocusTask.title}
          </h2>

          {/* Large Circular Countdown Display */}
          <div className="relative w-48 h-48 rounded-full border-4 border-[#89f5e7] flex flex-col items-center justify-center bg-white shadow-lg">
            <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-[#00685f]">
              {formatTime(remainingSeconds)}
            </span>
            <span className="font-mono text-xs text-[#6d7a77] mt-1">
              {formatTime(focusElapsedSeconds)} elapsed
            </span>
          </div>

          {/* Pause / Play Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleFocusPause}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#eae8e4] text-[#1b1c1a] font-semibold text-xs border border-[#e6e2d8] shadow-xs flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {focusIsPaused ? 'play_arrow' : 'pause'}
              </span>
              <span>{focusIsPaused ? 'Resume Focus' : 'Pause Focus'}</span>
            </button>
          </div>
        </div>

        {/* Reflection & Session Notes */}
        <div className="p-5 space-y-4 bg-white border-t border-[#e6e2d8] text-xs">
          <div>
            <label className="font-semibold text-[#1b1c1a] block mb-1.5">
              How is this session progressing?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'completed_planned', label: 'On Track / Planned Flow' },
                { id: 'took_longer', label: 'Taking Longer than Budget' },
                { id: 'partial', label: 'Partial Progress Made' },
                { id: 'interrupted', label: 'Interrupted by Question' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSessionOutcome(opt.id)}
                  className={`p-2 rounded-lg text-left border transition-all ${
                    sessionOutcome === opt.id
                      ? 'bg-[#89f5e7]/30 border-[#00685f] font-semibold text-[#00201d]'
                      : 'bg-[#f5f3ef] border-[#e6e2d8] text-[#3d4947]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#1b1c1a] block mb-1">Session Scratchpad</label>
            <textarea
              rows={2}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Jot transient thoughts or findings here to avoid context switching..."
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] p-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Log Session & Complete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
