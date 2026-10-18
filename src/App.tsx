/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { TodayDashboard } from './components/screens/TodayDashboard';
import { TaskEditor } from './components/screens/TaskEditor';
import { DynamicRebalanceScreen } from './components/screens/DynamicRebalanceScreen';
import { TasksBacklogScreen } from './components/screens/TasksBacklogScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { WeeklyPlanScreen } from './components/screens/WeeklyPlanScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { GoogleDriveScreen } from './components/screens/GoogleDriveScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { DailyReviewModal } from './components/modals/DailyReviewModal';
import { FocusSessionModal } from './components/modals/FocusSessionModal';
import { AuthModal } from './components/modals/AuthModal';

const MainLayout: React.FC = () => {
  const { currentScreen, realtimeMessages } = useApp();
  const [showNotificationsFeed, setShowNotificationsFeed] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'today':
        return <TodayDashboard />;
      case 'tasks':
        return <TasksBacklogScreen />;
      case 'task_editor':
        return <TaskEditor />;
      case 'dynamic':
        return <DynamicRebalanceScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'weekly':
        return <WeeklyPlanScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'drive':
        return <GoogleDriveScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TodayDashboard />;
    }
  };

  const latestMessage = realtimeMessages[0];

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a] flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex w-full pt-16">
        {/* Desktop Sidebar (hidden on task_editor screen for distraction-free editing) */}
        {currentScreen !== 'task_editor' && <Sidebar />}

        {/* Content Area */}
        <main
          className={`flex-1 flex flex-col relative w-full transition-all ${
            currentScreen !== 'task_editor' ? 'md:pl-64' : ''
          }`}
        >
          {/* Subtle Live Real-time Activity Ticker (Collapsible) */}
          {latestMessage && currentScreen !== 'task_editor' && (
            <div className="px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full pt-2">
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#efeeea]/80 border border-[#e6e2d8] text-[11px] text-[#3d4947]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-pulse flex-shrink-0" />
                  <span className="font-mono text-[10px] text-[#00685f] font-semibold flex-shrink-0">
                    {latestMessage.time}
                  </span>
                  <span className="truncate">{latestMessage.text}</span>
                </div>
                <button
                  onClick={() => setShowNotificationsFeed(!showNotificationsFeed)}
                  className="font-mono text-[10px] text-[#6d7a77] hover:text-[#1b1c1a] ml-2 flex-shrink-0 underline"
                >
                  {showNotificationsFeed ? 'Hide Log' : 'Live Log'}
                </button>
              </div>

              {/* Expanded real-time notification stream */}
              {showNotificationsFeed && (
                <div className="mt-1 p-2 bg-white rounded-xl border border-[#e6e2d8] shadow-md space-y-1 text-xs max-h-48 overflow-y-auto z-30">
                  <span className="text-[10px] font-mono uppercase text-[#6d7a77] block px-1">
                    Real-Time Schedule Events & Feed
                  </span>
                  {realtimeMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-1.5 rounded-lg bg-[#f5f3ef] flex items-start gap-2 text-[11px]"
                    >
                      <span className="font-mono text-[#00685f] font-semibold">{msg.time}</span>
                      <span className="text-[#1b1c1a] flex-1">{msg.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {currentScreen !== 'task_editor' && <BottomNav />}

      {/* Global Modals & Wizards */}
      <OnboardingModal />
      <DailyReviewModal />
      <FocusSessionModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
