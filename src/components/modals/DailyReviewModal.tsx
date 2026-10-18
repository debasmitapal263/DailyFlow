import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyReviewData } from '../../types';

export const DailyReviewModal: React.FC = () => {
  const { isDailyReviewOpen, closeDailyReview, tasks, saveDailyReview } = useApp();

  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    tasks.filter((t) => t.status === 'completed').map((t) => t.id)
  );

  const [disposition, setDisposition] = useState<Record<string, 'tomorrow' | 'someday' | 'split' | 'dropped'>>({
    task_7: 'tomorrow',
  });

  const [deviationReason, setDeviationReason] = useState<string>(
    'College seminar wrapped early, lab ran late (+45m), rebalanced'
  );
  const [energyRating, setEnergyRating] = useState<number>(8);
  const [recoveryAdequate, setRecoveryAdequate] = useState<boolean>(true);
  const [selfScore, setSelfScore] = useState<number>(8.5);
  const [improvementNote, setImprovementNote] = useState<string>(
    'Protect tomorrow 07:00 AM quiet focus window for BCI classification analysis.'
  );

  if (!isDailyReviewOpen) return null;

  const unfinishedTasks = tasks.filter((t) => !completedIds.includes(t.id));

  const getScoreGrade = (score: number) => {
    if (score >= 9) return 'Peak Day';
    if (score >= 7) return 'Sustainable Progress';
    if (score >= 5) return 'Needs Adjustment';
    if (score >= 3) return 'Overloaded or Disrupted';
    return 'Recovery Priority';
  };

  const handleSave = () => {
    const reviewPayload: DailyReviewData = {
      date: '2024-10-24',
      completedTaskIds: completedIds,
      unfinishedTaskDisposition: disposition,
      deviationReason,
      energyRating,
      recoveryAdequate,
      score: selfScore,
      scoreLabel: getScoreGrade(selfScore),
      oneImprovementNote: improvementNote,
      timestamp: new Date().toISOString(),
    };
    saveDailyReview(reviewPayload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf9f5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#e6e2d8] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e6e2d8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#89f5e7] flex items-center justify-center text-[#00201d]">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1b1c1a]">
                Daily 2-Minute Reflection & Audit
              </h2>
              <span className="text-[11px] text-[#6d7a77] font-mono">
                Honest progress without guilt or judgment
              </span>
            </div>
          </div>

          <button
            onClick={closeDailyReview}
            className="text-[#6d7a77] hover:text-[#1b1c1a] p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* Question 1: What did you actually complete? */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1b1c1a] block">
              1. What did you actually complete today?
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {tasks.map((t) => {
                const checked = completedIds.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'bg-[#89f5e7]/20 border-[#00685f]' : 'bg-white border-[#e6e2d8]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setCompletedIds((prev) =>
                          prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                        )
                      }
                      className="accent-[#00685f] rounded"
                    />
                    <span className={`text-xs ${checked ? 'font-semibold text-[#1b1c1a]' : 'text-[#3d4947]'}`}>
                      {t.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question 2: Unfinished disposition */}
          {unfinishedTasks.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1b1c1a] block">
                2. Disposition for remaining tasks (No automatic rollover)
              </label>
              <div className="space-y-2">
                {unfinishedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-white border border-[#e6e2d8] flex items-center justify-between gap-2"
                  >
                    <span className="truncate font-medium text-[#1b1c1a]">{t.title}</span>
                    <select
                      value={disposition[t.id] || 'tomorrow'}
                      onChange={(e) =>
                        setDisposition({
                          ...disposition,
                          [t.id]: e.target.value as any,
                        })
                      }
                      className="bg-[#f5f3ef] border border-[#e6e2d8] rounded-md px-2 py-1 text-[11px] focus:outline-none"
                    >
                      <option value="tomorrow">Reschedule Tomorrow</option>
                      <option value="split">Split Session</option>
                      <option value="someday">Move to Someday</option>
                      <option value="dropped">Cancel / Drop</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Why did the plan change? */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1b1c1a] block">
              3. Why did the timetable change?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'College Lab Overran (+45m)',
                'Seminar Wrapped Early',
                'Task Took Longer Than Expected',
                'Interrupted by Urgent Email',
                'Low Energy Decompression',
                'Executed Smoothly',
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setDeviationReason(reason)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    deviationReason.includes(reason)
                      ? 'bg-[#00685f] text-white border-[#00685f]'
                      : 'bg-white text-[#3d4947] border-[#e6e2d8] hover:bg-[#f5f3ef]'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Self Assessment Score */}
          <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1b1c1a]">
                4. Daily Sustainability Score (1–10)
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-bold text-[#00685f]">
                  {selfScore.toFixed(1)}/10
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#89f5e7]/40 text-[#005049] font-semibold">
                  {getScoreGrade(selfScore)}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={selfScore}
              onChange={(e) => setSelfScore(parseFloat(e.target.value))}
              className="w-full accent-[#00685f]"
            />

            <div className="flex justify-between text-[10px] text-[#6d7a77] font-mono">
              <span>1-2 Recovery Priority</span>
              <span>5-6 Needs Adjustment</span>
              <span>7-8 Sustainable</span>
              <span>9-10 Peak</span>
            </div>
          </div>

          {/* Question 5: Domino for tomorrow */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1b1c1a] block">
              5. Tomorrow's First Domino Action
            </label>
            <input
              type="text"
              value={improvementNote}
              onChange={(e) => setImprovementNote(e.target.value)}
              className="w-full bg-white text-[#1b1c1a] px-3 py-2 rounded-lg border border-[#e6e2d8] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#e6e2d8] flex items-center justify-between gap-3">
          <button
            onClick={closeDailyReview}
            className="px-4 py-2.5 rounded-xl border border-[#e6e2d8] text-xs font-semibold text-[#3d4947] hover:bg-[#f5f3ef]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Record Review & Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
};
