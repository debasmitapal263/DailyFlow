import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

export const TodayDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    toggleTaskCompleted,
    openTaskEditor,
    openFocusModal,
    focusElapsedSeconds,
    focusIsPaused,
    toggleFocusPause,
    stopFocusSession,
    rebuildDaySchedule,
    runningLate,
    needBreak,
    toggleLowEnergy,
    lowEnergyMode,
    finishCurrentEarly,
    smartBannerDismissed,
    dismissSmartBanner,
    openDailyReview,
    pacingMode,
    setPacingMode,
  } = useApp();

  const [triageFeedback, setTriageFeedback] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  // Deep work stats
  const deepWorkPlannedMinutes = tasks
    .filter((t) => t.energyRequired === 'deep')
    .reduce((sum, t) => sum + t.durationMinutes, 0);
  const deepWorkActualMinutes = tasks
    .filter((t) => t.energyRequired === 'deep')
    .reduce((sum, t) => sum + (t.actualDurationMinutes || (t.status === 'in_progress' ? Math.round(focusElapsedSeconds / 60) : 0)), 0);

  const deepWorkPlannedHours = (deepWorkPlannedMinutes / 60).toFixed(1);
  const deepWorkActualHours = (deepWorkActualMinutes / 60).toFixed(1);
  const deepWorkPercent = Math.min(100, Math.round((deepWorkActualMinutes / (deepWorkPlannedMinutes || 1)) * 100));

  const handleTriageAction = (actionName: string, callback: () => void) => {
    callback();
    setTriageFeedback(`Applied: ${actionName}`);
    setTimeout(() => setTriageFeedback(null), 2500);
  };

  const activeTask = tasks.find((t) => t.status === 'in_progress') || tasks.find((t) => t.id === 'task_5');
  const remainingMinutes = activeTask
    ? Math.max(0, activeTask.durationMinutes - Math.round(focusElapsedSeconds / 60))
    : 42;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 md:px-8 py-4 max-w-4xl mx-auto space-y-6 pb-28">
      {/* Top Context & Greeting Header */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#6d7a77]">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span className="font-mono text-xs text-[#6d7a77]">{currentUser.location}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eae8e4] text-[#3d4947] font-mono text-xs">
            {currentUser.termWeek}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1c1a] tracking-tight">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#3d4947] flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#00685f]" />
            <span>Focus:</span>
            <span className="text-[#1b1c1a] font-semibold truncate">
              MI Detection Methodology & Lab
            </span>
          </p>
        </div>

        {/* Energy State Pill & Quick Scheduler Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#89f5e7] flex items-center justify-center text-[#00201d] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#1b1c1a]">
                  {lowEnergyMode ? 'Low-Energy State' : 'High Focus State'}
                </span>
                <span className="text-[#6d7a77] text-[10px]">•</span>
                <span className="font-mono text-xs text-[#00685f] font-semibold">
                  {lowEnergyMode ? '3.0h Gentle Plan' : '6.5h Deep Plan'}
                </span>
              </div>
              <span className="text-[11px] text-[#6d7a77] truncate">
                Cognitive peak window: {currentUser.cognitivePeakWindow}
              </span>
            </div>
          </div>

          <button
            onClick={() => setPacingMode(pacingMode === 'balanced' ? 'deadline' : 'balanced')}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#eae8e4] text-[#3d4947] text-xs font-medium hover:text-[#1b1c1a] hover:bg-[#e4e2de] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Mode: {pacingMode === 'balanced' ? 'Balanced' : 'Deadline'}</span>
            <span className="material-symbols-outlined text-[14px]">tune</span>
          </button>
        </div>

        {/* Top Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => openTaskEditor()}
            className="h-11 px-4 rounded-xl bg-[#00685f] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-[#008378] active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Quick Add</span>
          </button>

          <button
            onClick={rebuildDaySchedule}
            className="h-11 px-4 rounded-xl bg-white text-[#1b1c1a] border border-[#e6e2d8] font-medium text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 hover:bg-[#f5f3ef] active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#712ae2]">auto_mode</span>
            <span>Rebuild Day</span>
          </button>
        </div>
      </section>

      {/* Balanced Progress Metrics (4 Honest Real-world Pillars) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1: Tasks Done */}
        <div className="p-3 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6d7a77]">
              Tasks Done
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">checklist</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1b1c1a]">
                {completedCount}
                <span className="text-[#6d7a77] text-xs font-normal">/{totalCount}</span>
              </span>
              <span className="font-mono text-xs text-[#00685f] font-semibold">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full bg-[#eae8e4] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#00685f] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Adherence / Timeline Flow */}
        <div className="p-3 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6d7a77]">
              Timeline Flow
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">pace</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1b1c1a]">88%</span>
              <span className="font-mono text-[10px] text-[#3d4947]">on-track</span>
            </div>
            <div className="w-full bg-[#eae8e4] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#316bf3] h-full rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        {/* Metric 3: Deep Work */}
        <div className="p-3 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6d7a77]">
              Deep Work
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#712ae2]">timer</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1b1c1a]">
                {deepWorkActualHours}
                <span className="text-[#6d7a77] text-xs font-normal">/{deepWorkPlannedHours}h</span>
              </span>
              <span className="font-mono text-xs text-[#712ae2] font-semibold">
                {deepWorkPercent}%
              </span>
            </div>
            <div className="w-full bg-[#eae8e4] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#8a4cfc] h-full rounded-full transition-all duration-500"
                style={{ width: `${deepWorkPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Recovery Buffer */}
        <div className="p-3 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6d7a77]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6d7a77]">
              Recovery Buffer
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#008378]">
              nature_people
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1b1c1a]">1.5h</span>
              <span className="font-mono text-[10px] text-[#008378] font-semibold">Protected</span>
            </div>
            <div className="w-full bg-[#eae8e4] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#6bd8cb] h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Schedule Intelligence Banner */}
      {!smartBannerDismissed && (
        <section className="flex items-start gap-3 p-3 rounded-xl bg-[#eaddff]/40 border border-[#d2bbff]/60 text-[#1b1c1a] shadow-xs">
          <div className="w-7 h-7 rounded-full bg-[#712ae2] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">spark</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#712ae2]">Smart Schedule Adjust</span>
              <span className="font-mono text-[10px] text-[#6d7a77]">13:42</span>
            </div>
            <p className="text-xs text-[#3d4947] mt-0.5 leading-snug">
              College seminar wrapped <span className="font-semibold text-[#1b1c1a]">20m early</span>. Shifted afternoon reading block ahead to preserve sunset daylight walk.
            </p>
          </div>
          <button
            aria-label="Dismiss banner"
            onClick={dismissSmartBanner}
            className="text-[#6d7a77] hover:text-[#1b1c1a] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </section>
      )}

      {/* Workspace Section Title */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00685f] text-[20px]">view_timeline</span>
          <h2 className="text-base sm:text-lg font-semibold text-[#1b1c1a] tracking-tight">
            Today's Flow Stream
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse" />
          <span className="font-mono text-xs text-[#00685f] font-semibold">14:15 CURRENT</span>
        </div>
      </div>

      {/* Vertical Interactive Time-Blocked Timeline */}
      <div className="relative flex flex-col space-y-3.5">
        {/* Continuous timeline vertical track */}
        <div className="absolute left-[38px] top-2 bottom-4 w-0.5 bg-[#eae8e4] -z-0" />

        {tasks.map((task) => {
          const isCompleted = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';
          const isPostponed = task.status === 'postponed';

          // Color strip identifier
          const accentColor =
            task.categoryId === 'phd'
              ? '#712ae2'
              : task.categoryId === 'career'
              ? '#0051d5'
              : task.categoryId === 'college'
              ? '#00685f'
              : task.categoryId === 'health'
              ? '#008378'
              : task.categoryId === 'recovery'
              ? '#6bd8cb'
              : task.categoryId === 'leisure'
              ? '#ba1a1a'
              : '#8a4cfc';

          return (
            <React.Fragment key={task.id}>
              {/* If this is the active in-progress task, render the NOW ACTIVE ticker right above it */}
              {isInProgress && (
                <div className="relative flex items-center gap-2 my-2 z-20">
                  <div className="w-14 text-right flex-shrink-0">
                    <span className="font-mono text-xs text-[#00685f] font-bold">14:15</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00685f] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,104,95,0.7)] animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#00685f] via-[#6bd8cb] to-transparent" />
                  <span className="font-mono text-[10px] text-[#00685f] px-2 py-0.5 rounded-full bg-[#89f5e7]/40 font-semibold flex-shrink-0">
                    NOW ACTIVE
                  </span>
                </div>
              )}

              <div
                className={`relative flex items-start gap-3 z-10 transition-all ${
                  isCompleted ? 'opacity-75' : isPostponed ? 'opacity-60' : 'opacity-100'
                }`}
              >
                {/* Time Rail */}
                <div className="w-14 flex flex-col items-end flex-shrink-0 pt-1.5">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isInProgress ? 'text-[#00685f] font-bold' : isCompleted ? 'text-[#6d7a77]' : 'text-[#1b1c1a]'
                    }`}
                  >
                    {task.scheduledStart}
                  </span>
                  <span className="font-mono text-[10px] text-[#6d7a77]">{task.scheduledEnd}</span>
                  <span className="font-mono text-[10px] text-[#6d7a77] mt-0.5">
                    {task.durationMinutes >= 60
                      ? `${(task.durationMinutes / 60).toFixed(1)}h`
                      : `${task.durationMinutes}m`}
                  </span>
                </div>

                {/* Node indicator */}
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-2 transition-all ${
                    isCompleted
                      ? 'bg-[#eae8e4] text-[#6d7a77] hover:bg-[#00685f] hover:text-white'
                      : isInProgress
                      ? 'bg-[#00685f] text-white ring-4 ring-[#89f5e7]/40 shadow-xs'
                      : 'bg-[#eae8e4] text-[#6d7a77] hover:border-[#00685f] border border-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  ) : isInProgress ? (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6d7a77]" />
                  )}
                </button>

                {/* Time Block Card */}
                <div
                  className={`flex-1 min-w-0 p-3 sm:p-4 rounded-xl shadow-xs border border-[#e6e2d8] relative overflow-hidden flex flex-col gap-1.5 transition-all ${
                    isInProgress
                      ? 'bg-white shadow-md ring-1 ring-[#00685f]/30'
                      : isCompleted
                      ? 'bg-white'
                      : 'bg-white'
                  }`}
                >
                  {/* Left accent strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* Header badges row */}
                  <div className="flex items-center justify-between gap-2 pl-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${accentColor}18`,
                          color: accentColor,
                        }}
                      >
                        ● {task.categoryId.toUpperCase()}
                      </span>

                      {task.urgency === 'critical' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white font-mono text-[10px] font-bold animate-pulse">
                          CRITICAL
                        </span>
                      )}
                      {task.urgency === 'high' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-mono text-[10px] font-semibold">
                          High Urgency
                        </span>
                      )}

                      {task.isAnchor && (
                        <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-[#6d7a77] uppercase font-semibold">
                          <span className="material-symbols-outlined text-[12px]">lock</span>
                          Fixed Anchor
                        </span>
                      )}

                      {task.location && (
                        <span className="font-mono text-[10px] text-[#6d7a77] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          {task.location}
                        </span>
                      )}

                      {isPostponed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] font-mono text-[10px] font-semibold">
                          Postponed to {task.postponedTo || 'Tomorrow'}
                        </span>
                      )}
                    </div>

                    {isCompleted && task.actualDurationMinutes && (
                      <span className="font-mono text-[11px] text-[#6d7a77] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px] text-[#00685f]">done_all</span>
                        {task.actualDurationMinutes}m actual
                      </span>
                    )}

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#89f5e7]/30 text-[#005049] font-mono text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px] animate-spin">timelapse</span>
                        {remainingMinutes}m left
                      </span>
                    )}
                  </div>

                  {/* Task Title & Notes */}
                  <div className="pl-2">
                    <p
                      className={`text-sm sm:text-base font-semibold text-[#1b1c1a] ${
                        isCompleted ? 'line-through text-[#6d7a77]' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="text-xs text-[#6d7a77] mt-0.5 line-clamp-2">{task.notes}</p>
                    )}
                    {task.splitInfo && (
                      <p className="text-xs text-[#00685f] mt-1 font-mono">{task.splitInfo}</p>
                    )}
                  </div>

                  {/* Active Task Live Action Controls Bar */}
                  {isInProgress && (
                    <div className="mt-2 pt-2 pl-2 -mx-3 -mb-3 p-3 bg-[#f5f3ef]/80 rounded-b-xl border-t border-[#e6e2d8] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs text-[#6d7a77]">
                        <span className="font-mono flex items-center gap-1 text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">tune</span>
                          Flexibility: ±30m FLEX
                        </span>
                        <span className="font-mono text-[11px] text-[#712ae2] font-semibold">
                          {Math.round(focusElapsedSeconds / 60)}m elapsed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={toggleFocusPause}
                          className="h-9 px-3 rounded-lg bg-[#eae8e4] text-[#1b1c1a] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#e4e2de] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {focusIsPaused ? 'play_arrow' : 'pause'}
                          </span>
                          <span>{focusIsPaused ? 'Resume Focus' : 'Pause Focus'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => stopFocusSession()}
                          className="h-9 px-3 rounded-lg bg-[#00685f] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#008378] active:scale-98 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Log Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Daily Review Reminder Action Card */}
      <section className="p-4 rounded-xl bg-gradient-to-r from-[#f5f3ef] to-[#efeeea] border border-[#e6e2d8] flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">fact_check</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1b1c1a]">End-of-Day 2-Minute Review</h3>
            <p className="text-xs text-[#6d7a77]">
              Reflect with honest metrics, rate sustainability (1-10), and sync report to Google Drive.
            </p>
          </div>
        </div>

        <button
          onClick={openDailyReview}
          className="px-3.5 py-2 rounded-lg bg-[#00685f] text-white text-xs font-semibold hover:bg-[#008378] active:scale-95 transition-all flex items-center gap-1 flex-shrink-0"
        >
          <span>Start Review</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </section>

      {/* Real-World Quick Triage Floating Drawer / Friction Bar */}
      <aside className="sticky bottom-2 z-40 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-[#e6e2d8] flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#1b1c1a] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">auto_fix_high</span>
            Quick Schedule Friction Solver
          </span>
          <span className="font-mono text-[10px] text-[#6d7a77]">1-Tap Adaptive Buffer</span>
        </div>

        {/* Triage Action Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleTriageAction('+30m Shift', () => runningLate(30))}
            className="px-2 py-2 rounded-xl bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#3d4947] hover:text-[#1b1c1a] text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
          >
            <span className="material-symbols-outlined text-[15px] text-[#712ae2]">history</span>
            <span>Running +30m late</span>
          </button>

          <button
            onClick={() => handleTriageAction('15m Rest Break', () => needBreak(15))}
            className="px-2 py-2 rounded-xl bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#3d4947] hover:text-[#1b1c1a] text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0051d5]">coffee</span>
            <span>Need 15m break</span>
          </button>

          <button
            onClick={() => handleTriageAction('Low Energy Mode', toggleLowEnergy)}
            className={`px-2 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center ${
              lowEnergyMode
                ? 'bg-[#ffebee] text-[#ba1a1a] font-semibold'
                : 'bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#3d4947]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#6d7a77]">
              battery_charging_full
            </span>
            <span>{lowEnergyMode ? 'Low energy active' : 'Low energy mode'}</span>
          </button>

          <button
            onClick={() => handleTriageAction('Finish Current', finishCurrentEarly)}
            className="px-2 py-2 rounded-xl bg-[#89f5e7]/40 hover:bg-[#89f5e7]/60 text-[#005049] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
          >
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>Finish Current</span>
          </button>
        </div>

        {triageFeedback && (
          <div className="text-center text-[11px] font-mono text-[#00685f] font-semibold animate-in fade-in duration-150">
            ✓ {triageFeedback}
          </div>
        )}
      </aside>
    </div>
  );
};
