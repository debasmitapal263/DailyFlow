import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const WeeklyPlanScreen: React.FC = () => {
  const { categories, tasks, openTaskEditor } = useApp();

  const [topOutcomes, setTopOutcomes] = useState([
    'Validate Motor Imagery BCI Pipeline with 10-fold cross validation',
    'Complete Graph Algorithms mock interviews (topological sort & Dijkstra)',
    'Synthesize Background Literature section 2.1 for thesis manuscript',
  ]);

  const [newOutcome, setNewOutcome] = useState('');

  const daysCapacity = [
    { day: 'Mon', capacity: 7.5, scheduled: 6.5, focus: 'Literature & Planning' },
    { day: 'Tue', dayNum: '22', capacity: 8.0, scheduled: 7.0, focus: 'College Lectures & Lab' },
    { day: 'Wed', dayNum: '23', capacity: 7.5, scheduled: 7.5, focus: 'Algorithm Mock Prep' },
    { day: 'Thu', dayNum: '24', capacity: 6.5, scheduled: 6.5, focus: 'MI Classifier Analysis (Today)' },
    { day: 'Fri', dayNum: '25', capacity: 6.0, scheduled: 5.0, focus: 'Faculty Standup & Lab Sync' },
    { day: 'Sat', dayNum: '26', capacity: 4.0, scheduled: 2.5, focus: 'Rest, Walking & Reading' },
    { day: 'Sun', dayNum: '27', capacity: 4.0, scheduled: 2.0, focus: 'Sunday Evening Weekly Review' },
  ];

  const handleAddOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutcome.trim()) return;
    setTopOutcomes((prev) => [...prev, newOutcome.trim()]);
    setNewOutcome('');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
            Weekly Planning Workspace
          </h1>
          <span className="font-mono text-xs text-[#00685f] bg-[#89f5e7]/30 px-2 py-0.5 rounded-full font-semibold">
            Term Wk 4
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#3d4947]">
          Calibrate weekly capacity, establish the top three domino outcomes, and avoid overfilling any single day.
        </p>
      </div>

      {/* Top 3 Strategic Outcomes */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f] text-[20px]">flag</span>
            <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
              This Week's Top Strategic Outcomes
            </h2>
          </div>
          <span className="font-mono text-xs text-[#6d7a77]">Max 3 Recommended</span>
        </div>

        <div className="space-y-2">
          {topOutcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#00685f] text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-[#1b1c1a] truncate">{outcome}</span>
              </div>
              <button
                onClick={() => setTopOutcomes(topOutcomes.filter((_, i) => i !== idx))}
                className="text-[#6d7a77] hover:text-[#ba1a1a] p-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}

          {topOutcomes.length < 3 && (
            <form onSubmit={handleAddOutcome} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add primary weekly milestone..."
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                className="flex-1 bg-[#f5f3ef] text-xs text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#00685f] text-white text-xs font-semibold rounded-lg hover:bg-[#008378]"
              >
                Add
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7-Day Capacity & Cognitive Load Distribution */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
              Weekly Capacity & Balance Radar
            </h2>
            <p className="text-xs text-[#6d7a77]">
              Total weekly budget: 43.5h • Scheduled: 37.0h • Unallocated Buffer: 6.5h
            </p>
          </div>
          <span className="material-symbols-outlined text-[#00685f] text-[22px]">bar_chart</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {daysCapacity.map((item) => {
            const isFull = item.scheduled >= item.capacity;
            return (
              <div
                key={item.day}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                  item.day === 'Thu'
                    ? 'bg-[#89f5e7]/20 border-[#00685f] ring-1 ring-[#00685f]'
                    : 'bg-[#f5f3ef] border-[#e6e2d8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1b1c1a]">{item.day}</span>
                    {item.day === 'Thu' && (
                      <span className="text-[9px] bg-[#00685f] text-white px-1 py-0.2 rounded font-mono">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[#3d4947] block mt-1">
                    {item.scheduled}h / {item.capacity}h
                  </span>
                </div>

                <div className="w-full bg-[#e4e2de] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? 'bg-[#ba1a1a]' : 'bg-[#00685f]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((item.scheduled / item.capacity) * 100))}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-[#6d7a77] line-clamp-1 leading-tight">{item.focus}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Unfinished Backlog Carry-Forward Panel */}
      <section className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5] text-[20px]">
              move_to_inbox
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
              Backlog & Carry-Forward Candidates
            </h2>
          </div>
          <button
            onClick={() => openTaskEditor()}
            className="text-xs text-[#00685f] font-semibold hover:underline"
          >
            + Add to backlog
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1b1c1a]">
                Calibrate EEG Filter Bandwidths (1–45Hz)
              </p>
              <p className="text-[11px] text-[#6d7a77]">
                PhD & Research • Carried forward from Tuesday • 45m required
              </p>
            </div>
            <button
              onClick={() => openTaskEditor()}
              className="px-2.5 py-1 bg-white hover:bg-[#eae8e4] rounded-lg text-xs font-semibold text-[#00685f] border border-[#e6e2d8]"
            >
              Place on Timetable
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1b1c1a]">Order Replacement Lab Breadboards</p>
              <p className="text-[11px] text-[#6d7a77]">
                College Responsibilities • Low urgency • 15m admin
              </p>
            </div>
            <button
              onClick={() => openTaskEditor()}
              className="px-2.5 py-1 bg-white hover:bg-[#eae8e4] rounded-lg text-xs font-semibold text-[#00685f] border border-[#e6e2d8]"
            >
              Place on Timetable
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
