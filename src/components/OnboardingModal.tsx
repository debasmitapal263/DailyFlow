import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const {
    categories,
    selectedCategoryIds,
    toggleCategorySelection,
    addCategory,
    completeOnboarding,
    showOnboarding,
    pacingMode,
    setPacingMode,
    lowEnergyMode,
    toggleLowEnergy,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [commitmentsOpen, setCommitmentsOpen] = useState<boolean>(true);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  // Custom Category form state
  const [customName, setCustomName] = useState('');
  const [customHours, setCustomHours] = useState('6h/wk');
  const [customFlex, setCustomFlex] = useState<'flexible' | 'fixed' | 'mixed'>('flexible');
  const [customColor, setCustomColor] = useState('#00685f');

  // Goals State (Step 3)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'goal_1',
    'goal_2',
    'goal_4',
    'goal_6',
  ]);

  const starterGoals = [
    { id: 'goal_1', title: 'Validate Motor Imagery BCI Pipeline', category: 'PhD & Research', deadline: 'Oct 31' },
    { id: 'goal_2', title: 'Complete 3 Graph Algorithms Mock Interviews', category: 'Career Prep', deadline: 'Nov 15' },
    { id: 'goal_3', title: 'Draft Background Literature Review Paper', category: 'PhD & Research', deadline: 'Nov 20' },
    { id: 'goal_4', title: 'Maintain 5x Weekly 45-min Morning Movement', category: 'Health & Movement', deadline: 'Ongoing' },
    { id: 'goal_5', title: 'Deliver DSP Filter Lab Cohort Supervision', category: 'College Duties', deadline: 'Weekly' },
    { id: 'goal_6', title: 'Protect 8 Hours Sleep & 21:30 Screen Cutoff', category: 'Recovery', deadline: 'Nightly' },
  ];

  if (!showOnboarding) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const hoursNum = parseInt(customHours.replace(/\D/g, ''), 10) || 5;
    addCategory({
      name: customName.trim(),
      color: customColor,
      textColor: '#ffffff',
      badgeBg: '#efeeea',
      targetHoursPerWeek: hoursNum,
      importance: 'medium',
      flexibility: customFlex,
      inReports: true,
      notes: 'Custom user bucket',
    });
    setCustomName('');
    setShowCustomForm(false);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding(selectedCategoryIds);
    }
  };

  const handleUseDefaults = () => {
    completeOnboarding(selectedCategoryIds);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf9f5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#e6e2d8] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Reassuring Header & Motivational Intro */}
          <div className="flex flex-col space-y-1.5 pt-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#89f5e7] text-[#00201d] text-xs">
                <span className="material-symbols-outlined text-[15px]">spa</span>
              </span>
              <span className="text-xs text-[#00685f] font-semibold tracking-wider uppercase">
                First-Time Setup
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
              Let's build a schedule that works for your life.
            </h1>
            <p className="text-xs sm:text-sm text-[#3d4947] leading-relaxed">
              A realistic schedule organizes work and recovery with quiet rhythm. Define the daily buckets under which your pursuits and rest thrive.
            </p>
          </div>

          {/* Interactive 4-Step Stepper */}
          <div className="bg-[#f5f3ef] rounded-xl p-3.5 shadow-xs border border-[#e6e2d8]">
            <div className="flex items-center justify-between relative mb-2">
              {/* Track line */}
              <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-1 bg-[#e4e2de] rounded-full -z-0">
                <div
                  className="h-1 bg-[#00685f] rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`relative z-10 flex flex-col items-center group transition-opacity ${
                  currentStep === 1 ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs transition-colors ${
                    currentStep >= 1
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#e4e2de] text-[#3d4947]'
                  }`}
                >
                  1
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep === 1 ? 'text-[#00685f] font-semibold' : 'text-[#3d4947]'
                  }`}
                >
                  Buckets
                </span>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`relative z-10 flex flex-col items-center group transition-opacity ${
                  currentStep === 2 ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs transition-colors ${
                    currentStep >= 2
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#e4e2de] text-[#3d4947]'
                  }`}
                >
                  2
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep === 2 ? 'text-[#00685f] font-semibold' : 'text-[#3d4947]'
                  }`}
                >
                  Rhythms
                </span>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`relative z-10 flex flex-col items-center group transition-opacity ${
                  currentStep === 3 ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs transition-colors ${
                    currentStep >= 3
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#e4e2de] text-[#3d4947]'
                  }`}
                >
                  3
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep === 3 ? 'text-[#00685f] font-semibold' : 'text-[#3d4947]'
                  }`}
                >
                  Goals
                </span>
              </button>

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className={`relative z-10 flex flex-col items-center group transition-opacity ${
                  currentStep === 4 ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs transition-colors ${
                    currentStep >= 4
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#e4e2de] text-[#3d4947]'
                  }`}
                >
                  4
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep === 4 ? 'text-[#00685f] font-semibold' : 'text-[#3d4947]'
                  }`}
                >
                  Rest
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[#3d4947] text-[11px] font-mono pt-1 px-1">
              <span className="text-[#00685f] font-semibold">
                Step {currentStep} of 4 • {currentStep === 1 ? 'Task Categories' : currentStep === 2 ? 'Recurring Timetable' : currentStep === 3 ? 'Targets & Deadlines' : 'Pacing & Recovery'}
              </span>
              <span className="bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full font-medium">
                Active Setup
              </span>
            </div>
          </div>

          {/* STEP 1: CATEGORY SETUP SECTION */}
          {currentStep === 1 && (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#1b1c1a]">Domain Categories</h2>
                  <p className="text-xs text-[#3d4947]">Tap to include or toggle commitment levels.</p>
                </div>
                <span className="bg-[#efeeea] text-[#00685f] font-mono text-xs px-2.5 py-1 rounded-full font-semibold">
                  {selectedCategoryIds.length} Selected
                </span>
              </div>

              {/* Category Cards Stack */}
              <div className="space-y-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className={`p-3 rounded-xl bg-white shadow-xs border border-[#e6e2d8] flex flex-col space-y-1.5 transition-all duration-200 ${
                        isSelected ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="text-sm font-semibold text-[#1b1c1a] truncate">
                                {cat.name}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#efeeea] text-[#1b1c1a] font-semibold font-mono">
                                {cat.targetHoursPerWeek}h/wk
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#00685f] text-white'
                              : 'bg-[#eae8e4] text-[#6d7a77]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isSelected ? 'check' : 'add'}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 flex-wrap gap-y-1 pt-0.5">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eae8e4] text-[#3d4947] font-mono">
                          {cat.flexibility === 'fixed'
                            ? 'Strictly Fixed'
                            : cat.flexibility === 'flexible'
                            ? 'Flexible Flow'
                            : 'Fixed & Flexible'}
                        </span>
                        {cat.inReports && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f3ef] text-[#00685f] font-mono flex items-center space-x-1">
                            <span className="material-symbols-outlined text-[12px]">analytics</span>
                            <span>Included in Reports</span>
                          </span>
                        )}
                        {cat.notes && (
                          <span className="text-[11px] text-[#6d7a77] truncate font-mono">
                            {cat.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Category Drawer */}
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#f5f3ef] hover:bg-[#eae8e4] rounded-xl text-[#00685f] text-xs font-semibold transition-colors shadow-xs border border-[#e6e2d8]"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Add Custom Category</span>
                </button>

                {showCustomForm && (
                  <form
                    onSubmit={handleAddCustom}
                    className="bg-white rounded-xl p-4 shadow-md border border-[#e6e2d8] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1b1c1a]">New Category Bucket</span>
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="text-[#6d7a77] hover:text-[#1b1c1a]"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#3d4947] mb-1">
                        Bucket Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g., Creative Writing, Startup Venture"
                        className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-[#3d4947] mb-1">
                          Weekly Target
                        </label>
                        <input
                          type="text"
                          value={customHours}
                          onChange={(e) => setCustomHours(e.target.value)}
                          placeholder="6h / week"
                          className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#3d4947] mb-1">
                          Negotiability
                        </label>
                        <select
                          value={customFlex}
                          onChange={(e) => setCustomFlex(e.target.value as any)}
                          className="w-full bg-[#f5f3ef] text-[#1b1c1a] px-3 py-2 rounded-lg text-xs focus:outline-none"
                        >
                          <option value="flexible">Flexible flow</option>
                          <option value="fixed">Strictly fixed</option>
                          <option value="mixed">Protected recovery</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#3d4947] mb-1">
                        Palette Accent
                      </label>
                      <div className="flex items-center space-x-2 pt-1">
                        {['#00685f', '#0051d5', '#712ae2', '#008378', '#ba1a1a', '#d97706'].map(
                          (c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCustomColor(c)}
                              className={`w-7 h-7 rounded-full transition-transform ${
                                customColor === c ? 'scale-115 ring-2 ring-[#00685f]' : ''
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-[#00685f] text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Save Bucket</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: RECURRING COMMITMENTS SECTION */}
          {currentStep === 2 && (
            <div className="bg-[#f5f3ef] rounded-xl p-4 shadow-xs border border-[#e6e2d8] space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setCommitmentsOpen(!commitmentsOpen)}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#e4e2de] text-[#1b1c1a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1b1c1a]">Daily Anchor Defaults</h3>
                    <p className="text-xs text-[#3d4947]">5 baseline commitments detected</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#6d7a77] transition-transform">
                  {commitmentsOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {commitmentsOpen && (
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 bg-white rounded-lg flex items-center justify-between shadow-xs border border-[#e6e2d8]">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px] text-[#6d7a77]">
                        wb_twilight
                      </span>
                      <span className="text-xs font-medium text-[#1b1c1a]">Weekday Wake</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-[#efeeea] px-2 py-0.5 rounded text-[#1b1c1a]">
                      6:00 AM
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg flex items-center justify-between shadow-xs border border-[#e6e2d8]">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px] text-[#00685f]">
                        psychology
                      </span>
                      <span className="text-xs font-medium text-[#1b1c1a]">Morning Deep Work</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded">
                      6:30 - 8:00 AM
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg flex items-center justify-between shadow-xs border border-[#e6e2d8]">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
                        school
                      </span>
                      <span className="text-xs font-medium text-[#1b1c1a]">College Responsibilities</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.5 rounded font-semibold font-mono">
                        Fixed
                      </span>
                      <span className="text-xs font-mono font-semibold bg-[#efeeea] px-2 py-0.5 rounded text-[#1b1c1a]">
                        10:30 AM - 5:30 PM
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg flex items-center justify-between shadow-xs border border-[#e6e2d8]">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px] text-[#6d7a77]">
                        restaurant
                      </span>
                      <span className="text-xs font-medium text-[#1b1c1a]">Dinner & Nourishment</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-[#efeeea] px-2 py-0.5 rounded text-[#1b1c1a]">
                      9:30 PM
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg flex items-center justify-between shadow-xs border border-[#e6e2d8]">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px] text-[#0051d5]">
                        bedtime
                      </span>
                      <span className="text-xs font-medium text-[#1b1c1a]">Wind-down & Sleep</span>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-[#dbe1ff] text-[#00174b] px-2 py-0.5 rounded">
                      11:00 PM
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6d7a77] text-center pt-1 font-mono">
                    All recurring anchors can be personalized in Calendar & Settings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: GOALS SECTION */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1b1c1a]">Select Your Current Priorities</h3>
                <p className="text-xs text-[#3d4947]">Choose 3–5 core outcomes to guide timetable distribution.</p>
              </div>

              <div className="space-y-2">
                {starterGoals.map((g) => {
                  const isChecked = selectedGoals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() =>
                        setSelectedGoals(prev =>
                          prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id]
                        )
                      }
                      className={`p-3 rounded-xl bg-white border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[#00685f] ring-1 ring-[#00685f]'
                          : 'border-[#e6e2d8] opacity-75'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-[#1b1c1a]">{g.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#00685f] font-mono bg-[#89f5e7]/30 px-1.5 py-0.5 rounded">
                            {g.category}
                          </span>
                          <span className="text-[10px] text-[#6d7a77] font-mono">
                            Target: {g.deadline}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-[#00685f] text-white' : 'border border-[#bcc9c6]'
                        }`}
                      >
                        {isChecked && <span className="material-symbols-outlined text-[14px]">check</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PACING & RECOVERY PREFERENCES */}
          {currentStep === 4 && (
            <div className="bg-[#f5f3ef] rounded-xl p-4 shadow-xs border border-[#e6e2d8] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1b1c1a]">Pacing & Recovery Mode</h3>
                  <p className="text-xs text-[#3d4947]">Balances work buffers against burn-out thresholds.</p>
                </div>
                <span className="material-symbols-outlined text-[#00685f] text-[22px]">tune</span>
              </div>

              {/* Balanced vs Deadline Switcher */}
              <div className="grid grid-cols-2 p-1 bg-[#efeeea] rounded-lg gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPacingMode('balanced')}
                  className={`py-2 rounded font-semibold text-center transition-all ${
                    pacingMode === 'balanced'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#3d4947] hover:text-[#1b1c1a]'
                  }`}
                >
                  Balanced Mode
                </button>
                <button
                  type="button"
                  onClick={() => setPacingMode('deadline')}
                  className={`py-2 rounded font-semibold text-center transition-all ${
                    pacingMode === 'deadline'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#3d4947] hover:text-[#1b1c1a]'
                  }`}
                >
                  Deadline Mode
                </button>
              </div>

              {/* Low Energy Option */}
              <div className="flex items-center justify-between pt-1">
                <div className="pr-3">
                  <span className="text-xs font-semibold text-[#1b1c1a] block">
                    Low-energy day protection
                  </span>
                  <span className="text-xs text-[#3d4947]">
                    Auto-downgrades intense deep blocks to recovery reading.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleLowEnergy}
                  className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors flex-shrink-0 ${
                    lowEnergyMode ? 'bg-[#00685f]' : 'bg-[#e4e2de]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      lowEnergyMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 px-4 rounded-xl bg-[#00685f] text-white text-sm font-semibold shadow-md hover:bg-[#008378] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>
                {currentStep === 4 ? 'Launch DayFlow Dashboard' : 'Continue to Next Step'}
              </span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={handleUseDefaults}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-[#3d4947] hover:text-[#1b1c1a] text-xs font-semibold shadow-xs border border-[#e6e2d8] transition-all flex items-center justify-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00685f]">bolt</span>
              <span>Use Recommended Defaults & Launch Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
