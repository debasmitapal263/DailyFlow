import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ReportsScreen: React.FC = () => {
  const {
    tasks,
    originalTasks,
    currentUser,
    downloadReportLocal,
    uploadReportToDrive,
    googleDrive,
  } = useApp();

  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const completed = tasks.filter((t) => t.status === 'completed');
  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  const planned = tasks.filter((t) => t.status === 'planned');

  const generateMarkdownReport = () => {
    return `# DayFlow ${reportType === 'daily' ? 'Daily Schedule' : 'Weekly Productivity'} Report
Date: 2024-10-24
User: ${currentUser.name} (${currentUser.role})
Location: ${currentUser.location}

## 1. Executive Summary
- Planned Tasks: ${tasks.length}
- Completed Tasks: ${completed.length}
- Schedule Adherence: 88%
- Deep Work Logged: 3.5h / 6.0h target
- Recovery Protected: 1.5h (100% boundary preserved)
- Daily Sustainability Score: 8.5/10 (Sustainable Progress)

## 2. Completed Pursuits
${completed.map((t) => `- [x] ${t.title} (${t.actualDurationMinutes || t.durationMinutes}m) [${t.categoryId}]`).join('\n')}

## 3. Active & Rescheduled Items
${inProgress.map((t) => `- [-] In Progress: ${t.title} (${t.durationMinutes}m)`).join('\n')}
${planned.map((t) => `- [ ] Next: ${t.title} (${t.scheduledStart} - ${t.scheduledEnd})`).join('\n')}

## 4. Schedule Changes & Adaptations
- Afternoon College Lab overran by 45m.
- Dynamically split "Experiment Analysis: MI Classifier Confusion Matrix" into two 45m blocks.
- Postponed Technical Interview Prep to Friday evening to avoid cutting into dinner/sleep recovery.

## 5. Strategic Takeaway & Tomorrow's Dominos
1. Complete remaining 45m MI Classifier Analysis at 07:00 AM (Peak Focus window).
2. Schedule algorithms practice with 75m buffer.
`;
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Task ID', 'Title', 'Category', 'Scheduled Start', 'Scheduled End', 'Duration (mins)', 'Status', 'Urgency', 'Flexibility'],
      ...tasks.map((t) => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.categoryId,
        t.scheduledStart,
        t.scheduledEnd,
        t.durationMinutes,
        t.status,
        t.urgency,
        t.flexibility,
      ]),
    ];
    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    downloadReportLocal(`DayFlow_Daily_2024-10-24`, csvContent, 'csv');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(
      {
        reportDate: '2024-10-24',
        user: currentUser,
        tasks,
        originalTasks,
        adherence: 88,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    );
    downloadReportLocal(`DayFlow_Daily_2024-10-24`, jsonContent, 'json');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopyFeedback('Markdown summary copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUploadDrive = async () => {
    setIsUploading(true);
    await uploadReportToDrive(`DayFlow_Daily_2024-10-24.pdf`, reportType);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-5 pb-24">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
            Summary Reports & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-[#3d4947]">
            Structured daily and weekly records ready for archiving, reflection, or Google Drive upload.
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="bg-[#efeeea] p-1 rounded-xl flex items-center text-xs self-start sm:self-auto">
          <button
            onClick={() => setReportType('daily')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              reportType === 'daily'
                ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                : 'text-[#3d4947] hover:text-[#1b1c1a]'
            }`}
          >
            Daily Report
          </button>
          <button
            onClick={() => setReportType('weekly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              reportType === 'weekly'
                ? 'bg-white text-[#1b1c1a] font-semibold shadow-xs'
                : 'text-[#3d4947] hover:text-[#1b1c1a]'
            }`}
          >
            Weekly Report
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-xl border border-[#e6e2d8] shadow-xs text-xs">
        <button
          onClick={handlePrint}
          className="px-3 py-2 rounded-lg bg-[#efeeea] hover:bg-[#eae8e4] text-[#1b1c1a] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
          <span>Print / Save as PDF</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="px-3 py-2 rounded-lg bg-[#efeeea] hover:bg-[#eae8e4] text-[#1b1c1a] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">table_chart</span>
          <span>Download CSV</span>
        </button>

        <button
          onClick={handleExportJSON}
          className="px-3 py-2 rounded-lg bg-[#efeeea] hover:bg-[#eae8e4] text-[#1b1c1a] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">data_object</span>
          <span>JSON Audit Log</span>
        </button>

        <button
          onClick={handleCopyMarkdown}
          className="px-3 py-2 rounded-lg bg-[#efeeea] hover:bg-[#eae8e4] text-[#1b1c1a] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          <span>Copy Markdown</span>
        </button>

        <button
          onClick={handleUploadDrive}
          disabled={isUploading}
          className="ml-auto px-4 py-2 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-75"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isUploading ? 'refresh' : 'cloud_upload'}
          </span>
          <span>{isUploading ? 'Uploading...' : 'Sync to Google Drive'}</span>
        </button>
      </div>

      {copyFeedback && (
        <div className="p-2 text-center text-xs font-mono text-[#00685f] bg-[#89f5e7]/30 rounded-lg font-semibold animate-in fade-in">
          ✓ {copyFeedback}
        </div>
      )}

      {/* Styled Printable Report Container */}
      <article className="bg-white rounded-2xl border border-[#e6e2d8] shadow-sm p-6 sm:p-8 space-y-6 text-[#1b1c1a] font-sans">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#e6e2d8]">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#00685f] font-semibold uppercase tracking-wider">
              DayFlow • Official Productivity & Well-being Audit
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {reportType === 'daily'
                ? 'Daily Schedule Realism & Adherence Record'
                : 'Weekly Progress & Cognitive Sustainability Ledger'}
            </h2>
            <p className="text-xs text-[#6d7a77] font-mono">
              Date: Thursday, Oct 24, 2024 • Academic Term Wk 4 • Cambridge, UK
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <p className="font-semibold text-[#1b1c1a]">{currentUser.name}</p>
            <p className="text-[#6d7a77]">{currentUser.role}</p>
            <p className="text-[#6d7a77] font-mono">{currentUser.email}</p>
          </div>
        </div>

        {/* Executive Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#f5f3ef] border border-[#e6e2d8]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6d7a77] block">Adherence</span>
            <span className="text-xl font-bold font-mono text-[#00685f]">88%</span>
            <span className="text-[10px] text-[#3d4947] block">On-track flow</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6d7a77] block">Task Ratio</span>
            <span className="text-xl font-bold font-mono text-[#1b1c1a]">
              {completed.length}/{tasks.length}
            </span>
            <span className="text-[10px] text-[#3d4947] block">Items fulfilled</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6d7a77] block">Deep Work</span>
            <span className="text-xl font-bold font-mono text-[#712ae2]">3.5h</span>
            <span className="text-[10px] text-[#3d4947] block">Of 6.0h planned</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6d7a77] block">Day Assessment</span>
            <span className="text-xl font-bold font-mono text-[#008378]">8.5/10</span>
            <span className="text-[10px] text-[#008378] font-semibold block">Sustainable</span>
          </div>
        </div>

        {/* Section 1: Completed Pursuits */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3d4947] border-b border-[#efeeea] pb-1">
            1. Completed Activities & Actual Session Times
          </h3>
          <div className="space-y-2">
            {completed.map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-lg bg-[#f5f3ef]/60 flex items-start justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1b1c1a]">{t.title}</span>
                    <span className="font-mono text-[10px] text-[#00685f] bg-[#89f5e7]/30 px-1.5 py-0.2 rounded font-semibold">
                      {t.categoryId}
                    </span>
                  </div>
                  {t.notes && <p className="text-[11px] text-[#6d7a77] mt-0.5">{t.notes}</p>}
                </div>
                <div className="font-mono text-right flex-shrink-0">
                  <span className="font-semibold text-[#1b1c1a]">
                    {t.actualDurationMinutes || t.durationMinutes}m
                  </span>
                  <span className="text-[10px] text-[#6d7a77] block">
                    {t.scheduledStart}–{t.scheduledEnd}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Rebalanced & Postponed Dispositions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3d4947] border-b border-[#efeeea] pb-1">
            2. Schedule Rebalancing Decisions & Reasons
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-[#eaddff] bg-[#eaddff]/20 space-y-1">
              <span className="font-semibold text-[#712ae2] block">
                • College Lab Overrun Incident (+45m overlap detected at 13:42)
              </span>
              <p className="text-[#3d4947]">
                Action: "Experiment Analysis: MI Classifier Confusion Matrix" was split into Part 1 (45m today) and Part 2 (tomorrow 07:00 AM). Fixed departmental anchors remained untouched.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-[#dbe1ff] bg-[#dbe1ff]/20 space-y-1">
              <span className="font-semibold text-[#0051d5] block">
                • Non-Critical Technical Interview Task Deflection
              </span>
              <p className="text-[#3d4947]">
                Action: Deferred to Friday evening (18:30) to preserve a 1.5h recovery and meal window before bedtime.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Priorities for Tomorrow */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3d4947] border-b border-[#efeeea] pb-1">
            3. Domino Tasks for Tomorrow Morning
          </h3>
          <ul className="text-xs space-y-1 text-[#1b1c1a] list-disc list-inside">
            <li>Part 2 of MI Classifier Analysis (07:00 AM – 07:45 AM).</li>
            <li>Prepare supervisor talking points for Friday 10:00 AM lab standup.</li>
            <li>Preserve 45-min sunset walk at 17:30.</li>
          </ul>
        </div>
      </article>
    </div>
  );
};
