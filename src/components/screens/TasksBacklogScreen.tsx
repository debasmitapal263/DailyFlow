import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UrgencyLevel, FlexibilityType } from '../../types';

export const TasksBacklogScreen: React.FC = () => {
  const { categories, tasks, toggleTaskCompleted, openTaskEditor, deleteTask } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && task.urgency !== selectedUrgency) return false;
    if (selectedStatus === 'pending' && task.status === 'completed') return false;
    if (selectedStatus === 'completed' && task.status !== 'completed') return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(task.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical':
        return <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">Critical</span>;
      case 'high':
        return <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">High</span>;
      case 'medium':
        return <span className="bg-[#efeeea] text-[#00685f] px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">Medium</span>;
      case 'low':
        return <span className="bg-[#dbe1ff] text-[#00174b] px-2 py-0.5 rounded-full text-[10px] font-mono">Low</span>;
      default:
        return <span className="bg-[#eae8e4] text-[#6d7a77] px-2 py-0.5 rounded-full text-[10px] font-mono">Someday</span>;
    }
  };

  const getFlexibilityBadge = (flex: FlexibilityType) => {
    switch (flex) {
      case 'strictly_fixed':
        return <span className="text-[#6d7a77] text-[10px] font-mono font-semibold flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">lock</span>Fixed</span>;
      case 'time_window':
        return <span className="text-[#00685f] text-[10px] font-mono font-semibold">Window ±30m</span>;
      case 'preferred':
        return <span className="text-[#0051d5] text-[10px] font-mono">Preferred</span>;
      default:
        return <span className="text-[#6d7a77] text-[10px] font-mono">Flexible</span>;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-5 pb-24">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
            Tasks & Commitments Deck
          </h1>
          <p className="text-xs sm:text-sm text-[#3d4947]">
            Manage, filter, and prioritize your academic, professional, and personal pursuits.
          </p>
        </div>

        <button
          onClick={() => openTaskEditor()}
          className="h-10 px-4 rounded-xl bg-[#00685f] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#008378] active:scale-95 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Task</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#e6e2d8] shadow-xs space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks, notes, or milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f3ef] text-xs sm:text-sm text-[#1b1c1a] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
          />
          <span className="material-symbols-outlined text-[18px] text-[#6d7a77] absolute left-2.5 top-2.5">
            search
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-[#6d7a77] whitespace-nowrap">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#00685f] text-white font-semibold'
                : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === c.id
                  ? 'bg-[#00685f] text-white font-semibold'
                  : 'bg-[#efeeea] text-[#3d4947] hover:bg-[#eae8e4]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs pt-1 border-t border-[#efeeea]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#6d7a77]">Urgency:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUrgency(u)}
                className={`px-2 py-0.5 rounded-md capitalize font-mono text-[11px] ${
                  selectedUrgency === u
                    ? 'bg-[#1b1c1a] text-white font-semibold'
                    : 'text-[#6d7a77] hover:text-[#1b1c1a]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-semibold text-[#6d7a77]">Status:</span>
            {['all', 'pending', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-2 py-0.5 rounded-md capitalize font-mono text-[11px] ${
                  selectedStatus === s
                    ? 'bg-[#00685f] text-white font-semibold'
                    : 'text-[#6d7a77] hover:text-[#1b1c1a]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#6d7a77] px-1 font-mono">
          <span>{filteredTasks.length} tasks matched</span>
          <span>Click checkmark to toggle status</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e6e2d8] space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#bcc9c6]">task</span>
            <p className="text-sm font-semibold text-[#1b1c1a]">No tasks in this view</p>
            <p className="text-xs text-[#6d7a77]">
              Clear filters or click "New Task" to capture a new priority.
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === 'completed';
            const cat = categories.find((c) => c.id === t.categoryId);

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl bg-white border border-[#e6e2d8] shadow-xs flex items-start gap-3 transition-all ${
                  isCompleted ? 'opacity-65' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(t.id)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isCompleted
                      ? 'bg-[#00685f] text-white'
                      : 'border-2 border-[#bcc9c6] hover:border-[#00685f]'
                  }`}
                >
                  {isCompleted && <span className="material-symbols-outlined text-[13px]">check</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: cat ? `${cat.color}15` : '#efeeea',
                        color: cat ? cat.color : '#1b1c1a',
                      }}
                    >
                      ● {cat ? cat.name : t.categoryId}
                    </span>
                    {getUrgencyBadge(t.urgency)}
                    {getFlexibilityBadge(t.flexibility)}
                    <span className="font-mono text-[11px] text-[#6d7a77]">
                      {t.durationMinutes}m
                    </span>
                    {t.deadline && (
                      <span className="font-mono text-[10px] text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded">
                        Due {t.deadline}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm font-semibold text-[#1b1c1a] mt-1 ${
                      isCompleted ? 'line-through text-[#6d7a77]' : ''
                    }`}
                  >
                    {t.title}
                  </h3>

                  {t.notes && (
                    <p className="text-xs text-[#6d7a77] mt-0.5 line-clamp-1">{t.notes}</p>
                  )}

                  {t.milestone && (
                    <div className="flex items-center gap-1 text-[11px] text-[#712ae2] mt-1 font-mono">
                      <span className="material-symbols-outlined text-[13px]">flag</span>
                      <span>{t.milestone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openTaskEditor(t.id)}
                    className="p-1.5 rounded-lg text-[#6d7a77] hover:text-[#00685f] hover:bg-[#f5f3ef] transition-colors"
                    title="Edit task"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 rounded-lg text-[#6d7a77] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                    title="Delete task"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
