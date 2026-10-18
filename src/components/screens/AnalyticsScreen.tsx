import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PAST_DAYS_METRICS } from '../../data/initialData';

export const AnalyticsScreen: React.FC = () => {
  const { tasks, categories, reviewHistory, setCurrentScreen } = useApp();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completionRate = Math.round((completedTasks.length / (tasks.length || 1)) * 100);

  // Category breakdown calculation
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const completedCatTasks = catTasks.filter((t) => t.status === 'completed');
    const spentMinutes = completedCatTasks.reduce(
      (sum, t) => sum + (t.actualDurationMinutes || t.durationMinutes),
      0
    );
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      targetHours: cat.targetHoursPerWeek,
      actualHours: (spentMinutes / 60).toFixed(1),
      percentOfTarget: Math.min(100, Math.round(((spentMinutes / 60) / (cat.targetHoursPerWeek || 1)) * 100)),
    };
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-6 pb-24">
      {/* Analytics Header & Time Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
            Schedule Adherence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#3d4947]">
            Balanced metrics distinguishing task execution, schedule realism, and sustainable recovery.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-[#efeeea] p-1 rounded-xl flex items-center text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  timeRange === r
                    ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                    : 'text-[#3d4947] hover:text-[#1b1c1a]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('reports')}
            className="h-9 px-3 rounded-lg bg-[#00685f] text-white text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-[#008378]"
          >
            <span className="material-symbols-outlined text-[16px]">summarize</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars of Honest Progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric A: Task Completion Rate */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Completion Rate</span>
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">done_all</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1b1c1a] font-mono">{completionRate}%</span>
              <span className="text-[11px] text-[#6d7a77]">
                ({completedTasks.length}/{tasks.length})
              </span>
            </div>
            <p className="text-[11px] text-[#6d7a77] mt-1">Planned items achieved</p>
          </div>
        </div>

        {/* Metric B: Time-Based Adherence */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Schedule Flow</span>
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">pace</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1b1c1a] font-mono">88%</span>
              <span className="text-[11px] text-[#00685f] font-semibold">on-track</span>
            </div>
            <p className="text-[11px] text-[#6d7a77] mt-1">Activities within windows</p>
          </div>
        </div>

        {/* Metric C: Duration Accuracy */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Estimation Delta</span>
            <span className="material-symbols-outlined text-[16px] text-[#712ae2]">tune</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1b1c1a] font-mono">+12m</span>
              <span className="text-[11px] text-[#712ae2] font-semibold">avg overrun</span>
            </div>
            <p className="text-[11px] text-[#6d7a77] mt-1">Planned vs actual session</p>
          </div>
        </div>

        {/* Metric D: Recovery & Sleep Boundaries */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Recovery Shield</span>
            <span className="material-symbols-outlined text-[16px] text-[#008378]">spa</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1b1c1a] font-mono">100%</span>
              <span className="text-[11px] text-[#008378] font-semibold">protected</span>
            </div>
            <p className="text-[11px] text-[#6d7a77] mt-1">Zero evening intrusions</p>
          </div>
        </div>
      </div>

      {/* Category Progress vs Weekly Targets */}
      <section className="bg-white rounded-xl p-4 border border-[#e6e2d8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1b1c1a]">Domain Category Progress (vs Weekly Target)</h2>
          <span className="text-xs text-[#6d7a77] font-mono">Target Hours / Actual Logged</span>
        </div>

        <div className="space-y-3">
          {categoryStats.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold text-[#1b1c1a]">{c.name}</span>
                </div>
                <div className="font-mono text-[11px] text-[#3d4947]">
                  <span className="font-semibold">{c.actualHours}h</span> of {c.targetHours}h/wk (
                  {c.percentOfTarget}%)
                </div>
              </div>
              <div className="w-full bg-[#efeeea] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${c.percentOfTarget}%`,
                    backgroundColor: c.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Schedule Intelligence & Observations */}
      <section className="bg-[#f5f3ef] rounded-xl p-4 border border-[#e6e2d8] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#00685f]">
          <span className="material-symbols-outlined text-[20px]">psychology</span>
          <h2 className="text-sm font-semibold text-[#1b1c1a]">
            Empirical Schedule Observations & Coaching
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#e6e2d8] space-y-1">
            <span className="font-semibold text-[#00685f] block">
              ● Morning Peak Window Consistency
            </span>
            <p className="text-[#3d4947] leading-relaxed">
              Your morning research sessions (06:30–08:00) had a 96% completion rate with zero interruptions, outperforming late afternoon blocks by 32%.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e6e2d8] space-y-1">
            <span className="font-semibold text-[#0051d5] block">
              ● Algorithms & Tech Duration Calibration
            </span>
            <p className="text-[#3d4947] leading-relaxed">
              Technical interview tasks regularly require 15–20 minutes more than budgeted. Recommend setting baseline slot default to 75m.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e6e2d8] space-y-1">
            <span className="font-semibold text-[#712ae2] block">
              ● Dynamic Rebalancing Graceful Resiliency
            </span>
            <p className="text-[#3d4947] leading-relaxed">
              When college lab overran by 45m today, splitting the MI Classifier task into two focused 45m sessions preserved evening recharge without dropping milestones.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#e6e2d8] space-y-1">
            <span className="font-semibold text-[#008378] block">
              ● Circadian Rest Boundaries Respected
            </span>
            <p className="text-[#3d4947] leading-relaxed">
              Zero scheduled work spilled past 20:00 this week. Preserved personal unwind time directly correlates with next-day 06:00 AM wake freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Historical Daily Scores Table */}
      <section className="bg-white rounded-xl p-4 border border-[#e6e2d8] shadow-xs space-y-3">
        <h2 className="text-sm font-semibold text-[#1b1c1a]">Daily Self-Assessment & Sustainability Trend</h2>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e6e2d8] text-[#6d7a77] font-mono text-[11px]">
                <th className="py-2">Date</th>
                <th className="py-2">Tasks Done</th>
                <th className="py-2">Deep Hours</th>
                <th className="py-2">Adherence</th>
                <th className="py-2">Self-Score</th>
                <th className="py-2">Assessment Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efeeea]">
              {PAST_DAYS_METRICS.map((m) => (
                <tr key={m.date} className="hover:bg-[#fbf9f5]">
                  <td className="py-2.5 font-mono text-[#1b1c1a] font-semibold">{m.date}</td>
                  <td className="py-2.5 font-mono">
                    {m.tasksCompleted}/{m.tasksPlanned}
                  </td>
                  <td className="py-2.5 font-mono">{m.deepWorkHours}h</td>
                  <td className="py-2.5 font-mono font-semibold text-[#00685f]">
                    {m.timelineAdherencePercent}%
                  </td>
                  <td className="py-2.5 font-mono font-bold text-[#1b1c1a]">{m.selfAssessmentScore}/10</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#89f5e7]/40 text-[#005049]">
                      {m.selfAssessmentScore >= 9 ? 'Peak Day' : 'Sustainable Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
