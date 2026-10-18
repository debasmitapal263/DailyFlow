import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CalendarScreen: React.FC = () => {
  const { tasks, openTaskEditor, categories, openDailyReview } = useApp();
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'agenda'>('day');

  const hours = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00',
  ];

  const weekDays = [
    { name: 'Mon', date: 'Oct 21' },
    { name: 'Tue', date: 'Oct 22' },
    { name: 'Wed', date: 'Oct 23' },
    { name: 'Thu', date: 'Oct 24', isToday: true },
    { name: 'Fri', date: 'Oct 25' },
    { name: 'Sat', date: 'Oct 26' },
    { name: 'Sun', date: 'Oct 27' },
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-5 pb-24">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
              Interactive Timetable
            </h1>
            <span className="text-xs font-mono font-semibold bg-[#89f5e7]/40 text-[#005049] px-2 py-0.5 rounded-full">
              Conflict-Aware
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#3d4947]">
            Visualizes commitments, anchor boundaries, and dynamically buffered openings.
          </p>
        </div>

        {/* View Switcher: Day, Week, Agenda */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-[#efeeea] p-1 rounded-xl flex items-center text-xs">
            {(['day', 'week', 'agenda'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  calendarView === view
                    ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                    : 'text-[#3d4947] hover:text-[#1b1c1a]'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button
            onClick={() => openTaskEditor()}
            className="h-9 px-3 rounded-lg bg-[#00685f] text-white text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-[#008378]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>
      </div>

      {/* DAY VIEW */}
      {calendarView === 'day' && (
        <div className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs overflow-hidden">
          <div className="p-3.5 bg-[#f5f3ef] border-b border-[#e6e2d8] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1b1c1a] font-mono">
              Thursday, October 24, 2024 • Academic Term Week 4
            </span>
            <span className="text-[11px] text-[#00685f] font-mono font-semibold">
              Peak: 14:00 – 17:30
            </span>
          </div>

          <div className="relative divide-y divide-[#efeeea] max-h-[640px] overflow-y-auto">
            {hours.map((hour) => {
              const hourTasks = tasks.filter((t) => t.scheduledStart.startsWith(hour.slice(0, 2)));

              return (
                <div key={hour} className="flex min-h-[60px] group hover:bg-[#fbf9f5]/50 transition-colors">
                  {/* Hour label */}
                  <div className="w-16 sm:w-20 p-2 text-right border-r border-[#efeeea] flex-shrink-0">
                    <span className="font-mono text-xs text-[#6d7a77]">{hour}</span>
                  </div>

                  {/* Slot content */}
                  <div className="flex-1 p-2 relative flex flex-col gap-1.5">
                    {/* Live time indicator */}
                    {hour.startsWith('14') && (
                      <div className="absolute left-0 right-0 top-3 border-t-2 border-[#00685f] z-20 flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] -ml-1.5 ring-2 ring-white" />
                        <span className="ml-2 font-mono text-[10px] bg-[#00685f] text-white px-1.5 py-0.2 rounded font-bold">
                          14:15 NOW
                        </span>
                      </div>
                    )}

                    {hourTasks.map((t) => {
                      const cat = categories.find((c) => c.id === t.categoryId);
                      const isCompleted = t.status === 'completed';

                      return (
                        <div
                          key={t.id}
                          onClick={() => openTaskEditor(t.id)}
                          className={`p-2.5 rounded-xl border border-[#e6e2d8] shadow-xs cursor-pointer hover:shadow-md transition-all flex items-start justify-between gap-2 ${
                            isCompleted ? 'bg-[#f5f3ef] opacity-75' : 'bg-white'
                          }`}
                          style={{ borderLeftWidth: '4px', borderLeftColor: cat?.color || '#00685f' }}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[11px] font-semibold text-[#1b1c1a]">
                                {t.scheduledStart} – {t.scheduledEnd}
                              </span>
                              <span
                                className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                                style={{
                                  backgroundColor: cat ? `${cat.color}15` : '#efeeea',
                                  color: cat?.color,
                                }}
                              >
                                {cat?.name}
                              </span>
                              {t.isAnchor && (
                                <span className="material-symbols-outlined text-[13px] text-[#6d7a77]">
                                  lock
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs font-semibold text-[#1b1c1a] mt-0.5 truncate ${
                                isCompleted ? 'line-through text-[#6d7a77]' : ''
                              }`}
                            >
                              {t.title}
                            </p>
                            {t.notes && (
                              <p className="text-[11px] text-[#6d7a77] truncate">{t.notes}</p>
                            )}
                          </div>

                          <span className="font-mono text-[11px] text-[#6d7a77] flex-shrink-0">
                            {t.durationMinutes}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {calendarView === 'week' && (
        <div className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#e6e2d8] divide-x divide-[#e6e2d8] text-center">
            {weekDays.map((d) => (
              <div
                key={d.name}
                className={`p-2.5 ${d.isToday ? 'bg-[#89f5e7]/20 font-bold text-[#00685f]' : 'bg-[#f5f3ef]'}`}
              >
                <div className="text-xs">{d.name}</div>
                <div className="font-mono text-xs">{d.date}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-[#efeeea] min-h-[460px] p-2 gap-y-2">
            {weekDays.map((d, index) => {
              const dayTasks = d.isToday ? tasks : tasks.slice(index % 3, (index % 3) + 3);
              return (
                <div key={d.name} className="flex flex-col gap-2 p-1">
                  {dayTasks.map((t) => {
                    const cat = categories.find((c) => c.id === t.categoryId);
                    return (
                      <div
                        key={t.id}
                        onClick={() => openTaskEditor(t.id)}
                        className="p-1.5 rounded-lg bg-[#f5f3ef] hover:bg-[#eae8e4] border border-[#e6e2d8] text-left cursor-pointer transition-colors"
                        style={{ borderLeftWidth: '3px', borderLeftColor: cat?.color || '#00685f' }}
                      >
                        <div className="font-mono text-[10px] text-[#6d7a77]">{t.scheduledStart}</div>
                        <div className="text-[11px] font-semibold text-[#1b1c1a] line-clamp-2">
                          {t.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA VIEW */}
      {calendarView === 'agenda' && (
        <div className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#1b1c1a]">Chronological Agenda Stream</h2>
          <div className="space-y-2">
            {tasks.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId);
              return (
                <div
                  key={t.id}
                  onClick={() => openTaskEditor(t.id)}
                  className="p-3 rounded-xl bg-[#f5f3ef] hover:bg-[#eae8e4] border border-[#e6e2d8] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat?.color || '#00685f' }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#1b1c1a]">{t.title}</p>
                      <p className="text-[11px] text-[#6d7a77]">
                        {cat?.name} • {t.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#00685f]">
                    {t.scheduledStart} – {t.scheduledEnd}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
