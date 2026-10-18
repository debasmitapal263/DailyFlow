import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UrgencyLevel, FlexibilityType, EnergyState } from '../../types';

export const TaskEditor: React.FC = () => {
  const { categories, addTask, updateTask, editingTaskId, tasks, closeTaskEditor } = useApp();

  const existingTask = editingTaskId ? tasks.find((t) => t.id === editingTaskId) : null;

  // NLP input state
  const [nlpInput, setNlpInput] = useState(
    existingTask
      ? existingTask.title
      : 'Work on the MI detection methodology for 90 minutes tomorrow morning, high priority, deadline Oct 31'
  );

  // Parsed NLP badges
  const [parsedAttributes, setParsedAttributes] = useState({
    duration: '90 mins',
    timing: 'Tomorrow 07:00 AM',
    urgency: 'High Urgency',
    categoryName: 'PhD & Research',
  });

  // Form Fields
  const [title, setTitle] = useState(
    existingTask?.title || 'Finalize Feature Extraction Pipeline for MI Dataset'
  );
  const [selectedCatId, setSelectedCatId] = useState(existingTask?.categoryId || 'phd');
  const [duration, setDuration] = useState<number>(existingTask?.durationMinutes || 90);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [flexibility, setFlexibility] = useState<FlexibilityType>(
    existingTask?.flexibility || 'time_window'
  );
  const [timeWindow, setTimeWindow] = useState(
    existingTask?.preferredWindow || { start: '07:00 AM', end: '11:00 AM' }
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(existingTask?.urgency || 'high');
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>(
    existingTask?.importance || 'high'
  );
  const [energy, setEnergy] = useState<EnergyState>(existingTask?.energyRequired || 'deep');
  const [minChunk, setMinChunk] = useState<number>(existingTask?.minChunkMinutes || 45);
  const [recoveryBuffer, setRecoveryBuffer] = useState<number>(
    existingTask?.recoveryBufferMinutes || 10
  );
  const [deadline, setDeadline] = useState(existingTask?.deadline || '2024-10-31');
  const [notes, setNotes] = useState(
    existingTask?.notes ||
      'Associated with thesis milestone: Chapter 4 Motor Imagery Validation. Cross-validation across subject cohorts.'
  );

  // Gemini API Classification State
  const [aiClassification, setAiClassification] = useState<{
    tag: 'Deep Work' | 'Admin' | 'Recovery';
    reason: string;
    source?: string;
  } | null>({
    tag: 'Deep Work',
    reason: 'Intellectually demanding mathematical and BCI synthesis requires deep focus.',
    source: 'gemini-3.8-flash',
  });
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Function to call Gemini API for auto-tagging
  const classifyWithGemini = async (titleText: string, descText: string) => {
    if (!titleText.trim() && !descText.trim()) return;
    setIsClassifying(true);
    setAiError(null);
    try {
      const res = await fetch('/api/classify-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleText,
          description: descText,
        }),
      });

      if (!res.ok) {
        throw new Error('Classification request failed');
      }

      const data = await res.json();
      const classifiedTag = data.tag as 'Deep Work' | 'Admin' | 'Recovery';
      setAiClassification({
        tag: classifiedTag,
        reason: data.reason || 'Classified based on cognitive effort profile.',
        source: data.source || 'gemini-3.8-flash',
      });

      // Automatically tag the task's energy state based on description
      if (classifiedTag === 'Deep Work') {
        setEnergy('deep');
      } else if (classifiedTag === 'Admin') {
        setEnergy('admin');
      } else if (classifiedTag === 'Recovery') {
        setEnergy('recovery');
      }
    } catch (err: any) {
      console.error('Gemini classification error:', err);
      setAiError('Auto-tagging unavailable. Please select energy state manually.');
    } finally {
      setIsClassifying(false);
    }
  };

  // Debounced auto-classification when title or description/notes changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const activeDesc = notes || nlpInput;
      if (title.trim() || activeDesc.trim()) {
        classifyWithGemini(title, activeDesc);
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [title, notes]);

  // Live NLP parsing
  useEffect(() => {
    const text = nlpInput.toLowerCase();
    let d = '90 mins';
    if (text.includes('25m') || text.includes('25 min')) d = '25 mins';
    else if (text.includes('45m') || text.includes('45 min')) d = '45 mins';
    else if (text.includes('60m') || text.includes('1 hour') || text.includes('60 min')) d = '60 mins';
    else if (text.includes('90m') || text.includes('90 min') || text.includes('1.5 hour')) d = '90 mins';
    else if (text.includes('2 hour') || text.includes('120m')) d = '120 mins';

    let urg = 'High Urgency';
    if (text.includes('critical') || text.includes('urgent') || text.includes('asap')) urg = 'Critical';
    else if (text.includes('low priority') || text.includes('someday')) urg = 'Low';
    else if (text.includes('medium')) urg = 'Medium';

    let cat = 'PhD & Research';
    if (text.includes('career') || text.includes('interview') || text.includes('algorithm')) cat = 'Career Prep';
    else if (text.includes('college') || text.includes('lecture') || text.includes('supervision')) cat = 'College';
    else if (text.includes('walk') || text.includes('gym') || text.includes('health')) cat = 'Health';
    else if (text.includes('rest') || text.includes('meditation')) cat = 'Recovery';

    setParsedAttributes({
      duration: d,
      timing: 'Tomorrow 07:00 AM',
      urgency: urg,
      categoryName: cat,
    });
  }, [nlpInput]);

  const handleDurationPreset = (mins: number) => {
    setDuration(mins);
    setCustomDuration('');
  };

  const handleSave = (autoPlace: boolean) => {
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      notes,
      categoryId: selectedCatId,
      urgency,
      importance,
      flexibility,
      preferredWindow: flexibility === 'time_window' ? timeWindow : undefined,
      scheduledStart: autoPlace ? '14:15' : '18:00',
      scheduledEnd: autoPlace ? '15:45' : '19:30',
      durationMinutes: duration,
      status: 'planned' as const,
      energyRequired: energy,
      minChunkMinutes: minChunk,
      recoveryBufferMinutes: recoveryBuffer,
      deadline,
      deadlineTime: '17:00',
      milestone: 'Chapter 4 Motor Imagery Validation',
    };

    if (existingTask) {
      updateTask({
        ...existingTask,
        ...taskPayload,
      });
    } else {
      addTask(taskPayload);
    }

    closeTaskEditor();
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Ambient Micro Header Status Indicator */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-2 h-2 rounded-full bg-[#00685f] animate-pulse" />
          <span className="font-mono text-[11px] text-[#3d4947] uppercase tracking-wider font-semibold">
            Cognitive Engine: Active
          </span>
        </div>
        <span className="font-mono text-xs text-[#6d7a77] bg-[#eae8e4] px-2 py-0.5 rounded">
          Flow Mode: 10s Fast Draft
        </span>
      </div>

      {/* 1. Natural Language Quick-Capture Card */}
      <section className="mb-4">
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-1.5 text-xs font-semibold text-[#00685f]"
              htmlFor="nlp-input"
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Natural Language Quick-Capture</span>
            </label>
            <span className="font-mono text-[10px] text-[#6d7a77] bg-[#efeeea] px-2 py-0.5 rounded-full">
              NLP v2.4
            </span>
          </div>

          <div className="relative w-full">
            <textarea
              id="nlp-input"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              rows={2}
              className="w-full bg-[#f5f3ef] text-[#1b1c1a] text-xs sm:text-sm rounded-lg p-2.5 pl-8 resize-none focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f] transition-all"
              placeholder="e.g., Work on MI detection methodology for 90m tomorrow morning, high priority..."
            />
            <span className="material-symbols-outlined text-[#6d7a77] absolute left-2.5 top-2.5 text-[18px]">
              auto_awesome
            </span>
          </div>

          {/* Live Parsed Badges / Interactivity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6d7a77]">Interpreted Attributes</span>
              <span className="font-mono text-[11px] text-[#00685f] flex items-center gap-0.5 font-semibold">
                <span className="material-symbols-outlined text-[12px]">done_all</span> 98% Match
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#efeeea] text-[#1b1c1a] font-mono text-xs shadow-xs">
                <span className="material-symbols-outlined text-[#00685f] text-[14px]">schedule</span>
                <span>{parsedAttributes.duration}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#efeeea] text-[#1b1c1a] font-mono text-xs shadow-xs">
                <span className="material-symbols-outlined text-[#0051d5] text-[14px]">
                  calendar_today
                </span>
                <span>{parsedAttributes.timing}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-mono text-xs shadow-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>{parsedAttributes.urgency}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-mono text-xs shadow-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">school</span>
                <span>{parsedAttributes.categoryName}</span>
              </div>
              {aiClassification && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#89f5e7]/40 text-[#005049] font-mono text-xs shadow-xs font-semibold animate-in fade-in">
                  <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                  <span>{aiClassification.tag} (Gemini)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Task Fields Container */}
      <section className="flex flex-col gap-4">
        {/* Task Title & Quick Memo */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="task-title"
              className="text-[11px] font-semibold text-[#6d7a77] uppercase tracking-wider"
            >
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f5f3ef] font-semibold text-sm sm:text-base text-[#1b1c1a] px-3 py-2 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f] transition-all"
            />
          </div>

          {/* Description & Context for Gemini Auto-Tagging */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="task-notes"
                className="text-[11px] font-semibold text-[#6d7a77] uppercase tracking-wider"
              >
                Task Description & Context
              </label>
              <button
                type="button"
                onClick={() => classifyWithGemini(title, notes || nlpInput)}
                disabled={isClassifying}
                className="text-[11px] text-[#00685f] hover:underline flex items-center gap-1 font-mono font-semibold"
              >
                <span className={`material-symbols-outlined text-[13px] ${isClassifying ? 'animate-spin' : ''}`}>
                  {isClassifying ? 'progress_activity' : 'psychology'}
                </span>
                <span>{isClassifying ? 'Analyzing...' : 'Auto-Tag with Gemini'}</span>
              </button>
            </div>
            <textarea
              id="task-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe requirements or context (Gemini automatically analyzes this to tag as Deep Work, Admin, or Recovery)..."
              className="w-full bg-[#f5f3ef] text-xs text-[#1b1c1a] px-3 py-2 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f] transition-all resize-none"
            />
          </div>

          {/* Category Domain Horizontal Scroller */}
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[11px] font-medium text-[#6d7a77]">Domain Category</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#712ae2] text-white ring-2 ring-[#eaddff]'
                        : 'bg-[#eae8e4] text-[#3d4947] hover:bg-[#e4e2de]'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: cat.color, color: '#ffffff' }
                        : {}
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? '#ffffff' : cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Duration Presets & Micro Selector */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[#6d7a77] uppercase tracking-wider">
              Estimated Duration
            </label>
            <span className="font-mono text-xs text-[#00685f] font-semibold">
              Total: {Math.floor(duration / 60)}h {duration % 60}m
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleDurationPreset(mins)}
                className={`py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                  duration === mins && !customDuration
                    ? 'bg-[#008378] text-white shadow-xs ring-1 ring-[#00685f]'
                    : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
                }`}
              >
                {mins}m
              </button>
            ))}
            <input
              type="text"
              placeholder="Custom"
              value={customDuration}
              onChange={(e) => {
                setCustomDuration(e.target.value);
                const num = parseInt(e.target.value.replace(/\D/g, ''), 10);
                if (num) setDuration(num);
              }}
              className={`py-2 px-1 rounded-lg text-xs font-mono text-center transition-all bg-[#eae8e4] text-[#1b1c1a] focus:outline-none focus:ring-1 focus:ring-[#00685f] ${
                customDuration ? 'ring-1 ring-[#00685f] bg-white font-semibold' : ''
              }`}
            />
          </div>
        </div>

        {/* Timing Negotiability / Flexibility Framework */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">tune</span>
              <span className="text-sm font-semibold text-[#1b1c1a]">Schedule Flexibility</span>
            </div>
            <span className="font-mono text-[10px] bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded-full font-semibold">
              Core Anchor
            </span>
          </div>
          <p className="text-xs text-[#6d7a77]">
            Define algorithm constraints when resolving daily calendar conflicts.
          </p>

          <div className="flex flex-col gap-2 mt-1">
            {/* Option 1: Strictly Fixed */}
            <label
              onClick={() => setFlexibility('strictly_fixed')}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                flexibility === 'strictly_fixed'
                  ? 'bg-[#f5f3ef] border-[#00685f]'
                  : 'bg-white border-[#e6e2d8] hover:bg-[#f5f3ef]'
              }`}
            >
              <input
                type="radio"
                name="timing-flex"
                checked={flexibility === 'strictly_fixed'}
                onChange={() => setFlexibility('strictly_fixed')}
                className="mt-1 accent-[#00685f]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1b1c1a]">Strictly Fixed</span>
                <span className="text-xs text-[#6d7a77]">
                  Cannot move without explicit manual user confirmation.
                </span>
              </div>
            </label>

            {/* Option 2: Time-Window Flexible */}
            <label
              onClick={() => setFlexibility('time_window')}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer shadow-xs ${
                flexibility === 'time_window'
                  ? 'bg-[#f5f3ef] border-[#00685f]'
                  : 'bg-white border-[#e6e2d8] hover:bg-[#f5f3ef]'
              }`}
            >
              <input
                type="radio"
                name="timing-flex"
                checked={flexibility === 'time_window'}
                onChange={() => setFlexibility('time_window')}
                className="mt-1 accent-[#00685f]"
              />
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00685f]">Time-Window Flexible</span>
                  <span className="font-mono text-[10px] bg-[#008378] text-white px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <span className="text-xs text-[#3d4947] mt-0.5">
                  Must occur within constrained optimal interval.
                </span>

                {flexibility === 'time_window' && (
                  <div className="mt-2 pt-2 flex items-center justify-between bg-white p-2 rounded-lg border border-[#e6e2d8]">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#1b1c1a]">
                      <span className="material-symbols-outlined text-[16px] text-[#00685f]">
                        wb_twilight
                      </span>
                      <span>{timeWindow.start}</span>
                      <span className="text-[#6d7a77]">to</span>
                      <span>{timeWindow.end}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStart = prompt('Enter start time (e.g. 08:00 AM):', timeWindow.start);
                        const newEnd = prompt('Enter end time (e.g. 12:00 PM):', timeWindow.end);
                        if (newStart && newEnd) {
                          setTimeWindow({ start: newStart, end: newEnd });
                        }
                      }}
                      className="text-xs text-[#00685f] font-semibold underline hover:text-[#008378]"
                    >
                      Modify
                    </button>
                  </div>
                )}
              </div>
            </label>

            {/* Option 3: Preferred Time */}
            <label
              onClick={() => setFlexibility('preferred')}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                flexibility === 'preferred'
                  ? 'bg-[#f5f3ef] border-[#00685f]'
                  : 'bg-white border-[#e6e2d8] hover:bg-[#f5f3ef]'
              }`}
            >
              <input
                type="radio"
                name="timing-flex"
                checked={flexibility === 'preferred'}
                onChange={() => setFlexibility('preferred')}
                className="mt-1 accent-[#00685f]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1b1c1a]">Preferred Time</span>
                <span className="text-xs text-[#6d7a77]">
                  Can shift if high-priority urgent focus conflict occurs.
                </span>
              </div>
            </label>

            {/* Option 4: Fully Flexible */}
            <label
              onClick={() => setFlexibility('fully_flexible')}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                flexibility === 'fully_flexible'
                  ? 'bg-[#f5f3ef] border-[#00685f]'
                  : 'bg-white border-[#e6e2d8] hover:bg-[#f5f3ef]'
              }`}
            >
              <input
                type="radio"
                name="timing-flex"
                checked={flexibility === 'fully_flexible'}
                onChange={() => setFlexibility('fully_flexible')}
                className="mt-1 accent-[#00685f]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1b1c1a]">Fully Flexible</span>
                <span className="text-xs text-[#6d7a77]">
                  Schedule in any compatible opening prior to deadline.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Urgency & Importance Matrix */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[#6d7a77] uppercase tracking-wider">
              Urgency Level
            </label>
            <div className="flex items-center gap-1 font-mono text-[10px] text-[#00685f] bg-[#efeeea] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[12px]">tips_and_updates</span>
              <span>AI Rec: High (5d left, 4.5h rem)</span>
            </div>
          </div>

          {/* Urgency Strip */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'critical', label: 'Critical', color: '#ba1a1a' },
              { id: 'high', label: 'High', color: '#ba1a1a' },
              { id: 'medium', label: 'Medium', color: '#00685f' },
              { id: 'low', label: 'Low', color: '#0051d5' },
              { id: 'someday', label: 'Someday', color: '#bcc9c6' },
            ].map((u) => {
              const isSelected = urgency === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgency(u.id as UrgencyLevel)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#ffdad6] text-[#93000a] font-bold shadow-xs border border-[#ba1a1a]/30'
                      : 'bg-[#f5f3ef] text-[#6d7a77] hover:bg-[#eae8e4]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mb-1"
                    style={{ backgroundColor: u.color }}
                  />
                  <span className="text-xs">{u.label}</span>
                </button>
              );
            })}
          </div>

          {/* Importance Assessment */}
          <div className="mt-1 pt-2 border-t border-[#efeeea] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] text-[20px]">stars</span>
              <span className="text-xs font-semibold text-[#1b1c1a]">Strategic Milestone</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setImportance(importance === 'high' ? 'medium' : importance === 'medium' ? 'low' : 'high')
              }
              className="text-xs text-[#0051d5] font-semibold bg-[#dbe1ff] px-2.5 py-1 rounded-full hover:bg-[#b4c5ff] transition-colors"
            >
              {importance === 'high' ? 'High Value' : importance === 'medium' ? 'Medium Value' : 'Low Value'}
            </button>
          </div>
        </div>

        {/* 3. Cognitive Context Fold */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a4cfc] text-[20px]">cognition</span>
              <span className="text-sm font-semibold text-[#1b1c1a]">Cognitive Context</span>
            </div>

            <button
              type="button"
              onClick={() => classifyWithGemini(title, notes || nlpInput)}
              disabled={isClassifying}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#89f5e7]/30 text-[#005049] text-xs font-mono font-semibold hover:bg-[#89f5e7]/50 transition-colors disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[14px] ${isClassifying ? 'animate-spin' : ''}`}>
                {isClassifying ? 'progress_activity' : 'auto_awesome'}
              </span>
              <span>{isClassifying ? 'Tagging...' : 'Auto-Tag with Gemini'}</span>
            </button>
          </div>

          {/* Gemini AI Auto-Tag Banner */}
          {aiClassification && (
            <div className="p-3 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8] space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00685f]">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  <span>Gemini Tag:</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#00685f] text-white">
                    {aiClassification.tag}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#6d7a77]">gemini-3.8-flash</span>
              </div>
              <p className="text-[11px] text-[#3d4947] leading-relaxed">
                {aiClassification.reason}
              </p>
            </div>
          )}

          {aiError && (
            <div className="text-[11px] text-[#ba1a1a] bg-[#ffdad6] p-2 rounded-lg font-mono">
              {aiError}
            </div>
          )}

          {/* Energy Level Selector (Deep Work, Admin, Recovery, Balanced) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-[#6d7a77]">Required Energy State</label>
              <span className="text-[10px] text-[#6d7a77] font-mono">Tap any to manually override</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {/* Option 1: Deep Work */}
              <button
                type="button"
                onClick={() => setEnergy('deep')}
                className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                  energy === 'deep'
                    ? 'bg-[#00685f] text-white shadow-xs font-semibold ring-2 ring-[#00685f]'
                    : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
                }`}
              >
                {aiClassification?.tag === 'Deep Work' && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✦
                  </span>
                )}
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="text-[11px] mt-0.5 whitespace-nowrap">Deep Work</span>
              </button>

              {/* Option 2: Admin */}
              <button
                type="button"
                onClick={() => setEnergy('admin')}
                className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                  energy === 'admin'
                    ? 'bg-[#00685f] text-white shadow-xs font-semibold ring-2 ring-[#00685f]'
                    : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
                }`}
              >
                {aiClassification?.tag === 'Admin' && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✦
                  </span>
                )}
                <span className="material-symbols-outlined text-[18px]">assignment</span>
                <span className="text-[11px] mt-0.5 whitespace-nowrap">Admin</span>
              </button>

              {/* Option 3: Recovery */}
              <button
                type="button"
                onClick={() => setEnergy('recovery')}
                className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                  energy === 'recovery'
                    ? 'bg-[#00685f] text-white shadow-xs font-semibold ring-2 ring-[#00685f]'
                    : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
                }`}
              >
                {aiClassification?.tag === 'Recovery' && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ✦
                  </span>
                )}
                <span className="material-symbols-outlined text-[18px]">spa</span>
                <span className="text-[11px] mt-0.5 whitespace-nowrap">Recovery</span>
              </button>

              {/* Option 4: Balanced */}
              <button
                type="button"
                onClick={() => setEnergy('balanced')}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  energy === 'balanced'
                    ? 'bg-[#00685f] text-white shadow-xs font-semibold ring-2 ring-[#00685f]'
                    : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">battery_horiz_075</span>
                <span className="text-[11px] mt-0.5 whitespace-nowrap">Balanced</span>
              </button>
            </div>
          </div>

          {/* Min Chunk & Recovery Buffer */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1 p-2 bg-[#efeeea] rounded-lg">
              <span className="text-[11px] text-[#6d7a77]">Min Chunk Session</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#1b1c1a]">{minChunk} mins</span>
                <span className="material-symbols-outlined text-[#6d7a77] text-[16px]">lock_clock</span>
              </div>
              <span className="font-mono text-[10px] text-[#6d7a77]">Ignores &lt;45m gaps</span>
            </div>

            <div className="flex flex-col gap-1 p-2 bg-[#efeeea] rounded-lg">
              <span className="text-[11px] text-[#6d7a77]">Recovery Buffer</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#00685f]">
                  +{recoveryBuffer} mins
                </span>
                <span className="material-symbols-outlined text-[#00685f] text-[16px]">spa</span>
              </div>
              <span className="font-mono text-[10px] text-[#6d7a77]">Post-session cooloff</span>
            </div>
          </div>
        </div>

        {/* 4. Deadline & Milestones Panel */}
        <div className="bg-white shadow-xs rounded-xl p-4 border border-[#e6e2d8] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[#6d7a77] uppercase tracking-wider">
              Hard Deadline
            </label>
            <span className="font-mono text-[10px] text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded-full font-semibold">
              5 Days Remaining
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#efeeea] p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00685f] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">event_busy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1b1c1a]">Oct 31, 2024</span>
                <span className="font-mono text-xs text-[#6d7a77]">17:00 PM EST</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const newD = prompt('Set deadline YYYY-MM-DD:', deadline);
                if (newD) setDeadline(newD);
              }}
              className="w-8 h-8 rounded-full bg-[#eae8e4] hover:bg-[#e4e2de] flex items-center justify-center text-[#1b1c1a] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
            </button>
          </div>
        </div>

        {/* Visual Anchor: Contextual Work Graphic */}
        <div className="w-full rounded-xl overflow-hidden shadow-xs relative h-36 border border-[#e6e2d8]">
          <img
            alt="Researcher Desk Setup"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8worywhL_uScReHoL4v_eAYTGliqpFYIgGDcu1cK6Y0AzpTvBeq57cB4dPyqImwcq0Zo7iu2wZJJKbCo-wQ8FcwkxaOY1_NGpwkP5MhQ_IOodFuoKw68vz2mg7nPJhgp9p3gEuwuKDZbbeOhbZSvVrwjMJa6Ul1BwExZasCQ1X7z8LtV5NHTPKYm2fUeIJb_tkHV5sJrD3c8cspnkT48-WVywikOsbbCdv3qIDzmd3DYBoZxFHFQG"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs text-white flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[15px]">psychology_alt</span>
              Associated with thesis milestone: Chapter 4 Motor Imagery Validation
            </span>
          </div>
        </div>
      </section>

      {/* 5. Fixed-Bottom Action Dock (Thumb Ergonomics) */}
      <footer className="sticky bottom-0 z-40 bg-[#fbf9f5]/90 backdrop-blur-md py-3 flex flex-col gap-2 mt-4 border-t border-[#e6e2d8]">
        <button
          type="button"
          onClick={() => handleSave(true)}
          className="w-full py-3 px-4 rounded-xl bg-[#00685f] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#008378] active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">event_seat</span>
          <span>Save & Auto-Place on Timetable</span>
        </button>

        <button
          type="button"
          onClick={() => handleSave(false)}
          className="w-full py-2.5 px-4 rounded-xl bg-white text-[#3d4947] hover:text-[#1b1c1a] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs border border-[#e6e2d8] hover:bg-[#f5f3ef] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">move_to_inbox</span>
          <span>Add to Unscheduled Backlog</span>
        </button>
      </footer>
    </div>
  );
};
