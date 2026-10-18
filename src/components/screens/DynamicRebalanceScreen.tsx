import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RebalanceStrategy } from '../../types';

export const DynamicRebalanceScreen: React.FC = () => {
  const {
    rebalanceStrategy,
    setRebalanceStrategy,
    applyRebalancePlan,
    setCurrentScreen,
    activeIncident,
  } = useApp();

  const [viewMode, setViewMode] = useState<'adjusted' | 'original'>('adjusted');
  const [rationaleExpanded, setRationaleExpanded] = useState<boolean>(true);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const handleConfirm = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyRebalancePlan();
      setIsApplying(false);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 sm:px-6 py-4 space-y-5 pb-24">
      {/* Flow State Header Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#6d7a77] tracking-wider uppercase">
            Adjustment Protocol
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
            Dynamic Rebalancing
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#89f5e7]/40 flex items-center justify-center text-[#00685f]">
          <span className="material-symbols-outlined text-[22px]">auto_mode</span>
        </div>
      </div>

      {/* Incident Notification Card */}
      <section className="bg-white rounded-xl p-4 shadow-xs border border-[#e6e2d8] space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#eaddff] flex items-center justify-center text-[#25005a] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">timelapse</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#1b1c1a] truncate">
                {activeIncident ? activeIncident.title : 'Afternoon Lab Extended'}
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-semibold flex-shrink-0">
                +45m Overlap
              </span>
            </div>
            <p className="text-xs text-[#3d4947] mt-1 leading-relaxed">
              {activeIncident
                ? activeIncident.description
                : '45 minute overlap detected. Two flexible tasks automatically recalculated. All fixed commitments remain safe.'}
            </p>
          </div>
        </div>

        {/* Quick Strategy Selector */}
        <div className="space-y-1.5 pt-1 border-t border-[#efeeea]">
          <span className="text-[11px] font-medium text-[#6d7a77]">Rebalance Archetype</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'balanced', label: 'Balanced Recovery' },
              { id: 'deadline', label: 'Deadline Focus' },
              { id: 'low_cog', label: 'Low Cognitive Load' },
            ].map((strat) => {
              const isSelected = rebalanceStrategy === strat.id;
              return (
                <button
                  key={strat.id}
                  type="button"
                  onClick={() => setRebalanceStrategy(strat.id as RebalanceStrategy)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#eae8e4] text-[#3d4947] hover:bg-[#e4e2de]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-[#89f5e7]' : 'bg-[#6d7a77]'
                    }`}
                  />
                  <span>{strat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Schedule Comparison View */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00685f] text-[20px]">
              calendar_view_day
            </span>
            <h3 className="text-sm font-semibold text-[#1b1c1a]">Timeline Projection</h3>
          </div>

          {/* Segmented Toggle Control */}
          <div className="bg-[#efeeea] p-1 rounded-full flex items-center text-xs">
            <button
              onClick={() => setViewMode('adjusted')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                viewMode === 'adjusted'
                  ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                  : 'text-[#3d4947] hover:text-[#1b1c1a]'
              }`}
            >
              Adjusted
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                viewMode === 'original'
                  ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                  : 'text-[#3d4947] hover:text-[#1b1c1a]'
              }`}
            >
              Original
            </button>
          </div>
        </div>

        {/* Live Reactive Timeline Stream: ADJUSTED VIEW */}
        {viewMode === 'adjusted' ? (
          <div className="space-y-2.5 transition-opacity duration-300">
            {/* Slot 1: Adjusted split focus block */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e6e2d8] relative overflow-hidden flex gap-3">
              <div className="w-1 bg-[#00685f] rounded-full absolute left-0 top-0 bottom-0" />
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#00685f] font-bold">15:00</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">15:45</span>
                <span className="font-mono text-[10px] text-[#6d7a77] mt-1">45m</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] truncate">
                    MI Classifier Analysis
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#89f5e7]/40 text-[#005049] text-[10px] font-semibold font-mono">
                    Split Session
                  </span>
                </div>
                <p className="text-xs text-[#3d4947] mt-1 leading-snug">
                  Part 1 of 2. Remainder queued for tomorrow at 07:00 AM (Quiet Focus window).
                </p>
              </div>
            </div>

            {/* Slot 2: Strict Fixed Meeting Anchor */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e6e2d8] relative overflow-hidden flex gap-3">
              <div className="w-1 bg-[#6d7a77] rounded-full absolute left-0 top-0 bottom-0" />
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#1b1c1a] font-bold">16:00</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">17:30</span>
                <span className="font-mono text-[10px] text-[#6d7a77] mt-1">90m</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] truncate">
                    Faculty Dept Meeting
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#6d7a77]">lock</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eae8e4] text-[#3d4947] font-mono">
                    Strictly Fixed Anchor
                  </span>
                </div>
              </div>
            </div>

            {/* Slot 3: Cognitive Transit Buffer */}
            <div className="bg-[#f5f3ef] rounded-xl p-3 flex items-center justify-between shadow-xs border border-[#e6e2d8]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#eae8e4] flex items-center justify-center text-[#3d4947]">
                  <span className="material-symbols-outlined text-[18px]">self_improvement</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1b1c1a]">Transit & Mental Rest</div>
                  <div className="font-mono text-[11px] text-[#6d7a77]">17:45 – 18:15 (30m buffer)</div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#00685f] font-semibold bg-[#89f5e7]/30 px-2 py-0.5 rounded-full">
                Protected
              </span>
            </div>

            {/* Slot 4: AI Re-routed task card */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e6e2d8] relative overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#00174b] flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">forward</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] truncate block">
                      Technical Interview Prep
                    </span>
                    <div className="text-xs text-[#3d4947] mt-1 leading-snug">
                      Deferred to Friday evening (18:30) to preserve energy levels and avoid task clipping.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] font-mono font-semibold whitespace-nowrap">
                  Postponed
                </span>
              </div>
            </div>

            {/* Slot 5: Evening Shield Protected Time */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e6e2d8] relative overflow-hidden flex gap-3">
              <div className="w-1 bg-[#712ae2] rounded-full absolute left-0 top-0 bottom-0" />
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#1b1c1a] font-bold">20:00</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">20:45</span>
                <span className="font-mono text-[10px] text-[#6d7a77] mt-1">45m</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] truncate">
                    Dinner & Offline Time
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#712ae2]">shield</span>
                </div>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-[#eaddff] text-[#25005a] text-[10px] font-semibold font-mono">
                  Protected Personal Time
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ORIGINAL SCHEDULE WITH CONFLICT HIGHLIGHTS */
          <div className="space-y-2.5 transition-opacity duration-300">
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#ba1a1a]/40 flex gap-3 opacity-80">
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#ba1a1a] font-bold">14:15</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">15:45</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] line-through">
                  MI Classifier Analysis (90m block)
                </span>
                <p className="text-xs text-[#ba1a1a] mt-1 font-mono">
                  ⚠️ Collided with extended Lab session (+45m overlap)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#e6e2d8] flex gap-3 opacity-80">
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#1b1c1a] font-bold">16:00</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">17:30</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a]">
                  Faculty Dept Meeting
                </span>
                <p className="text-xs text-[#6d7a77] mt-1">Unchanged (Strict Fixed Anchor)</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#ba1a1a]/40 flex gap-3 opacity-80">
              <div className="flex flex-col items-start min-w-[64px] flex-shrink-0">
                <span className="font-mono text-xs text-[#ba1a1a] font-bold">18:00</span>
                <span className="font-mono text-[10px] text-[#6d7a77]">19:30</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-[#1b1c1a] line-through">
                  Technical Interview Prep
                </span>
                <p className="text-xs text-[#ba1a1a] mt-1 font-mono">
                  ⚠️ Compressed down to zero recovery buffer
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Visual Cognitive Energy Graph Mini-Banner */}
      <section className="bg-[#efeeea] rounded-xl p-3.5 space-y-2 border border-[#e6e2d8]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#3d4947]">Predicted Cognitive Load</span>
          <span className="font-mono text-xs text-[#00685f] font-semibold">Optimal 68%</span>
        </div>
        <div className="w-full h-8 flex items-end gap-1.5 pt-1">
          <div className="w-1/6 bg-[#6bd8cb] h-4 rounded-t-sm" title="14:00 Baseline" />
          <div className="w-1/6 bg-[#008378] h-8 rounded-t-sm" title="15:00 Split Lab Focus" />
          <div className="w-1/6 bg-[#00685f] h-6 rounded-t-sm" title="16:00 Dept Meeting" />
          <div className="w-1/6 bg-[#e4e2de] h-2 rounded-t-sm" title="17:30 Rest" />
          <div className="w-1/6 bg-[#b4c5ff] h-4 rounded-t-sm" title="19:00 Buffer" />
          <div className="w-1/6 bg-[#eaddff] h-3 rounded-t-sm" title="20:00 Dinner" />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-[#6d7a77]">
          <span>14:00</span>
          <span>16:00</span>
          <span>18:00</span>
          <span>20:00</span>
        </div>
      </section>

      {/* AI Scheduling Rationale Accordion */}
      <section className="bg-white rounded-xl shadow-xs border border-[#e6e2d8] overflow-hidden">
        <button
          type="button"
          onClick={() => setRationaleExpanded(!rationaleExpanded)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#f5f3ef] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#00685f]">psychology</span>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#1b1c1a]">
                Algorithmic Rationale
              </div>
              <div className="text-xs text-[#6d7a77]">3 heuristics applied to safeguard flow</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#6d7a77]">
            {rationaleExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {rationaleExpanded && (
          <div className="px-3.5 pb-3.5 space-y-2 pt-1 border-t border-[#efeeea]">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ef]">
              <span className="material-symbols-outlined text-[#00685f] text-[18px] mt-0.5">
                verified_user
              </span>
              <div>
                <div className="text-xs font-semibold text-[#1b1c1a]">
                  Protected Inflexible Anchors
                </div>
                <div className="text-xs text-[#3d4947] mt-0.5">
                  Faculty Department Meeting has multiple attendees and was flagged strictly unmovable.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ef]">
              <span className="material-symbols-outlined text-[#00685f] text-[18px] mt-0.5">
                pie_chart
              </span>
              <div>
                <div className="text-xs font-semibold text-[#1b1c1a]">
                  Focus Fragment Guard (≥45m)
                </div>
                <div className="text-xs text-[#3d4947] mt-0.5">
                  Truncating deep tasks below 40 minutes degrades synthesis quality. ML task cleanly halved instead.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ef]">
              <span className="material-symbols-outlined text-[#00685f] text-[18px] mt-0.5">
                bedtime
              </span>
              <div>
                <div className="text-xs font-semibold text-[#1b1c1a]">
                  Circadian Decompression Reserve
                </div>
                <div className="text-xs text-[#3d4947] mt-0.5">
                  Prevented cascading work past 20:00 to keep evening restorative sleep boundaries undisturbed.
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Visual Accent Inspiration Card */}
      <div className="rounded-xl overflow-hidden relative shadow-xs h-32 flex items-end p-3.5 bg-[#eae8e4] border border-[#e6e2d8]">
        <img
          alt="Serene Minimalist Desk"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2Prt4KGEASZnMyzgyl0_ndt7KqFETRntlPsl9f0CiWgyt6RTHAuMJ6Uc1ahHIapxl_RuJRJfVvuWZR-29y3ZPYb6rGm-ujgZrleXlGoFKNauQBLe_lKwjxyWaBTu4pXwgJwqt0LxXl26lJX5267ohGthlea7g_avE-Y2hRoZBSyaArXazeL7IDwb9sMgo2K8mWrSaRTxAlUK1A9FEnFqFTD5PCDVcK5tbu_Fau7OjABIxOOJFk2w"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 text-white flex items-center justify-between w-full">
          <div>
            <p className="text-[11px] font-semibold text-[#89f5e7]">Deep Momentum</p>
            <p className="text-xs text-white">"Clarity comes from graceful compromise."</p>
          </div>
          <span className="material-symbols-outlined text-[#89f5e7] text-[20px]">spa</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isApplying}
          className="w-full h-12 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform disabled:opacity-75"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isApplying ? 'refresh' : 'check_circle'}
          </span>
          <span>{isApplying ? 'Rebalancing & Locking...' : 'Confirm Adapted Timetable'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('today')}
          className="w-full h-11 bg-white hover:bg-[#f5f3ef] text-[#3d4947] hover:text-[#1b1c1a] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-[#e6e2d8] shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Modify Manually on Today Stream</span>
        </button>
      </div>
    </div>
  );
};
