import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Task,
  UserProfile,
  ScheduleIncident,
  GoogleDriveStatus,
  DailyReviewData,
  PacingMode,
  RebalanceStrategy,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_TASKS,
  INITIAL_INCIDENT,
  INITIAL_DRIVE_STATUS,
  PAST_DAYS_METRICS,
} from '../data/initialData';

interface RealtimeMessage {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'reschedule' | 'success' | 'alert';
}

interface AppContextType {
  currentUser: UserProfile;
  switchUser: (user: UserProfile) => void;
  categories: Category[];
  selectedCategoryIds: string[];
  toggleCategorySelection: (catId: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;

  tasks: Task[];
  originalTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;

  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  editingTaskId: string | null;
  openTaskEditor: (taskId?: string) => void;
  closeTaskEditor: () => void;

  pacingMode: PacingMode;
  setPacingMode: (mode: PacingMode) => void;
  lowEnergyMode: boolean;
  setLowEnergyMode: (val: boolean) => void;
  toggleLowEnergy: () => void;

  rebalanceStrategy: RebalanceStrategy;
  setRebalanceStrategy: (strategy: RebalanceStrategy) => void;
  incidents: ScheduleIncident[];
  activeIncident: ScheduleIncident | null;
  dismissIncident: (id: string) => void;
  applyRebalancePlan: () => void;

  // Active Focus Session
  activeFocusTask: Task | null;
  focusElapsedSeconds: number;
  focusIsPaused: boolean;
  isFocusModalOpen: boolean;
  openFocusModal: (task?: Task) => void;
  closeFocusModal: () => void;
  startFocusSession: (task: Task) => void;
  toggleFocusPause: () => void;
  stopFocusSession: (logDurationMinutes?: number) => void;

  // Friction Solver Actions
  runningLate: (minutes: number) => void;
  needBreak: (minutes: number) => void;
  finishCurrentEarly: () => void;
  rebuildDaySchedule: () => void;

  // Daily Review
  isDailyReviewOpen: boolean;
  openDailyReview: () => void;
  closeDailyReview: () => void;
  saveDailyReview: (review: DailyReviewData) => void;
  reviewHistory: DailyReviewData[];

  // Google Drive
  googleDrive: GoogleDriveStatus;
  connectGoogleDrive: () => void;
  disconnectGoogleDrive: () => void;
  uploadReportToDrive: (reportName: string, type: 'daily' | 'weekly') => Promise<boolean>;
  downloadReportLocal: (reportName: string, content: string, extension: string) => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  completeOnboarding: (selectedCats?: string[]) => void;

  // Smart adjustment dismissible banner
  smartBannerDismissed: boolean;
  dismissSmartBanner: () => void;

  // Real-time messages feed
  realtimeMessages: RealtimeMessage[];
  addRealtimeMessage: (text: string, type?: 'info' | 'reschedule' | 'success' | 'alert') => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state keys
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dayflow_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('dayflow_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('dayflow_selected_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES.map(c => c.id);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dayflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [originalTasks, setOriginalTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dayflow_original_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [currentScreen, setCurrentScreen] = useState<string>('today');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [pacingMode, setPacingMode] = useState<PacingMode>('balanced');
  const [lowEnergyMode, setLowEnergyMode] = useState<boolean>(false);
  const [rebalanceStrategy, setRebalanceStrategy] = useState<RebalanceStrategy>('balanced');

  const [incidents, setIncidents] = useState<ScheduleIncident[]>([INITIAL_INCIDENT]);
  const [smartBannerDismissed, setSmartBannerDismissed] = useState<boolean>(false);

  // Active focus session
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(() => {
    return tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.id === 'task_5') || null;
  });
  const [focusElapsedSeconds, setFocusElapsedSeconds] = useState<number>(48 * 60); // 48 mins elapsed
  const [focusIsPaused, setFocusIsPaused] = useState<boolean>(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);

  // Daily review
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState<boolean>(false);
  const [reviewHistory, setReviewHistory] = useState<DailyReviewData[]>(() => {
    const saved = localStorage.getItem('dayflow_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Google Drive
  const [googleDrive, setGoogleDrive] = useState<GoogleDriveStatus>(() => {
    const saved = localStorage.getItem('dayflow_drive');
    return saved ? JSON.parse(saved) : INITIAL_DRIVE_STATUS;
  });

  // Onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('dayflow_onboarding_completed') !== 'true';
  });

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Real-time messages
  const [realtimeMessages, setRealtimeMessages] = useState<RealtimeMessage[]>([
    {
      id: 'msg_1',
      time: '13:42',
      text: 'College seminar wrapped 20m early. Shifted afternoon reading block ahead to preserve sunset daylight walk.',
      type: 'reschedule',
    },
    {
      id: 'msg_2',
      time: '14:15',
      text: 'PhD Deep Work Session started: Experiment Analysis: MI Classifier Confusion Matrix.',
      type: 'info',
    },
  ]);

  // Persist
  useEffect(() => {
    localStorage.setItem('dayflow_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dayflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('dayflow_selected_categories', JSON.stringify(selectedCategoryIds));
  }, [selectedCategoryIds]);

  useEffect(() => {
    localStorage.setItem('dayflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dayflow_original_tasks', JSON.stringify(originalTasks));
  }, [originalTasks]);

  useEffect(() => {
    localStorage.setItem('dayflow_drive', JSON.stringify(googleDrive));
  }, [googleDrive]);

  useEffect(() => {
    localStorage.setItem('dayflow_reviews', JSON.stringify(reviewHistory));
  }, [reviewHistory]);

  // Focus Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeFocusTask && !focusIsPaused) {
      interval = setInterval(() => {
        setFocusElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeFocusTask, focusIsPaused]);

  const addRealtimeMessage = (text: string, type: 'info' | 'reschedule' | 'success' | 'alert' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: RealtimeMessage = {
      id: `msg_${Date.now()}`,
      time: timeStr,
      text,
      type,
    };
    setRealtimeMessages(prev => [newMsg, ...prev.slice(0, 19)]);
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
    addRealtimeMessage(`Switched workspace profile to ${user.name} (${user.role})`, 'info');
  };

  const toggleCategorySelection = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newId = `cat_${Date.now()}`;
    const newCategory: Category = { ...cat, id: newId };
    setCategories(prev => [...prev, newCategory]);
    setSelectedCategoryIds(prev => [...prev, newId]);
    addRealtimeMessage(`Created new category bucket: "${cat.name}"`, 'success');
  };

  const updateCategory = (cat: Category) => {
    setCategories(prev => prev.map(c => (c.id === cat.id ? cat : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setSelectedCategoryIds(prev => prev.filter(cid => cid !== id));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    addRealtimeMessage(`Scheduled new task: "${newTask.title}" at ${newTask.scheduledStart}`, 'success');
  };

  const updateTask = (updated: Task) => {
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    if (activeFocusTask?.id === updated.id) {
      setActiveFocusTask(updated);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeFocusTask?.id === id) {
      setActiveFocusTask(null);
    }
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'planned' : 'completed';
          return {
            ...t,
            status: nextStatus,
            actualDurationMinutes: nextStatus === 'completed' ? t.durationMinutes : undefined,
          };
        }
        return t;
      })
    );
    const target = tasks.find(t => t.id === id);
    if (target) {
      const isFinishing = target.status !== 'completed';
      addRealtimeMessage(
        isFinishing ? `Marked "${target.title}" as complete.` : `Reopened "${target.title}".`,
        isFinishing ? 'success' : 'info'
      );
    }
  };

  const openTaskEditor = (taskId?: string) => {
    setEditingTaskId(taskId || null);
    setCurrentScreen('task_editor');
  };

  const closeTaskEditor = () => {
    setEditingTaskId(null);
    setCurrentScreen('today');
  };

  const toggleLowEnergy = () => {
    const nextVal = !lowEnergyMode;
    setLowEnergyMode(nextVal);
    if (nextVal) {
      addRealtimeMessage(
        'Low-Energy Protection Mode activated. Auto-downgraded intense blocks to reading & reflection.',
        'alert'
      );
    } else {
      addRealtimeMessage('Balanced Energy Mode restored.', 'info');
    }
  };

  const dismissSmartBanner = () => {
    setSmartBannerDismissed(true);
  };

  const activeIncident = incidents.find(i => !i.resolved) || null;

  const dismissIncident = (id: string) => {
    setIncidents(prev => prev.map(i => (i.id === id ? { ...i, resolved: true } : i)));
    addRealtimeMessage('Schedule conflict marked resolved.', 'info');
  };

  const applyRebalancePlan = () => {
    // Modify tasks in real schedule according to dynamic rebalancing proposal
    setTasks(prev =>
      prev.map(t => {
        if (t.id === 'task_5') {
          return {
            ...t,
            scheduledStart: '15:00',
            scheduledEnd: '15:45',
            durationMinutes: 45,
            isSplitPart: true,
            splitInfo: 'Part 1 of 2. Remainder queued for tomorrow at 07:00 AM (Quiet Focus window).',
          };
        }
        if (t.id === 'task_7') {
          return {
            ...t,
            status: 'postponed',
            postponedTo: 'Friday evening (18:30)',
            notes: 'Deferred to Friday evening (18:30) to preserve energy levels and avoid task clipping.',
          };
        }
        return t;
      })
    );

    if (activeIncident) {
      dismissIncident(activeIncident.id);
    }
    addRealtimeMessage(
      'Adapted Timetable confirmed: MI Classifier split (45m today + 45m tomorrow), Technical Interview postponed.',
      'reschedule'
    );
    setCurrentScreen('today');
  };

  // Focus Session Controls
  const openFocusModal = (task?: Task) => {
    if (task) {
      setActiveFocusTask(task);
      setFocusElapsedSeconds(task.actualDurationMinutes ? task.actualDurationMinutes * 60 : 0);
    }
    setIsFocusModalOpen(true);
  };

  const closeFocusModal = () => {
    setIsFocusModalOpen(false);
  };

  const startFocusSession = (task: Task) => {
    setActiveFocusTask(task);
    setFocusElapsedSeconds(0);
    setFocusIsPaused(false);
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: 'in_progress' } : t)));
    addRealtimeMessage(`Focus timer started for "${task.title}".`, 'info');
  };

  const toggleFocusPause = () => {
    setFocusIsPaused(prev => !prev);
    addRealtimeMessage(focusIsPaused ? 'Focus session resumed.' : 'Focus session paused.', 'info');
  };

  const stopFocusSession = (logDurationMinutes?: number) => {
    if (activeFocusTask) {
      const duration = logDurationMinutes ?? Math.round(focusElapsedSeconds / 60);
      setTasks(prev =>
        prev.map(t =>
          t.id === activeFocusTask.id
            ? {
                ...t,
                status: 'completed',
                actualDurationMinutes: duration,
              }
            : t
        )
      );
      addRealtimeMessage(`Completed and logged ${duration}m on "${activeFocusTask.title}".`, 'success');
      setActiveFocusTask(null);
      setIsFocusModalOpen(false);
    }
  };

  // Friction Solvers
  const runningLate = (minutes: number) => {
    setTasks(prev =>
      prev.map(t => {
        // Strictly fixed commitments cannot move
        if (t.flexibility === 'strictly_fixed' || t.isAnchor) {
          return t;
        }
        if (t.status === 'in_progress' || t.status === 'planned') {
          // Adjust time forward by minutes
          const [sh, sm] = t.scheduledStart.split(':').map(Number);
          const [eh, em] = t.scheduledEnd.split(':').map(Number);
          const totalStartMins = sh * 60 + sm + minutes;
          const totalEndMins = eh * 60 + em + minutes;
          const newStart = `${Math.floor(totalStartMins / 60)
            .toString()
            .padStart(2, '0')}:${(totalStartMins % 60).toString().padStart(2, '0')}`;
          const newEnd = `${Math.floor(totalEndMins / 60)
            .toString()
            .padStart(2, '0')}:${(totalEndMins % 60).toString().padStart(2, '0')}`;
          return {
            ...t,
            scheduledStart: newStart,
            scheduledEnd: newEnd,
          };
        }
        return t;
      })
    );
    addRealtimeMessage(`Schedule adjusted: Added +${minutes}m buffer; fixed anchors preserved.`, 'reschedule');
  };

  const needBreak = (minutes: number) => {
    addRealtimeMessage(`Added a ${minutes}m cognitive restoration break. Flexible afternoon tasks adjusted.`, 'info');
  };

  const finishCurrentEarly = () => {
    if (activeFocusTask) {
      stopFocusSession();
    } else {
      const active = tasks.find(t => t.status === 'in_progress');
      if (active) {
        toggleTaskCompleted(active.id);
      }
    }
  };

  const rebuildDaySchedule = () => {
    setCurrentScreen('dynamic');
    addRealtimeMessage('Initiated dynamic rebalancing protocol to resolve overlap and energy load.', 'info');
  };

  // Daily Review
  const openDailyReview = () => setIsDailyReviewOpen(true);
  const closeDailyReview = () => setIsDailyReviewOpen(false);
  const saveDailyReview = (review: DailyReviewData) => {
    setReviewHistory(prev => [review, ...prev]);
    setIsDailyReviewOpen(false);
    addRealtimeMessage(
      `Daily Review recorded! Self-assessment score: ${review.score}/10 (${review.scoreLabel}).`,
      'success'
    );
    if (googleDrive.autoUploadDaily && googleDrive.connected) {
      uploadReportToDrive(`DayFlow_Daily_${review.date}.pdf`, 'daily');
    }
  };

  // Google Drive
  const connectGoogleDrive = () => {
    setGoogleDrive(prev => ({
      ...prev,
      connected: true,
      accountEmail: currentUser.email,
    }));
    addRealtimeMessage(`Connected Google Drive account for ${currentUser.email}`, 'success');
  };

  const disconnectGoogleDrive = () => {
    setGoogleDrive(prev => ({
      ...prev,
      connected: false,
      accountEmail: undefined,
    }));
    addRealtimeMessage('Disconnected Google Drive.', 'info');
  };

  const uploadReportToDrive = async (reportName: string, type: 'daily' | 'weekly'): Promise<boolean> => {
    if (!googleDrive.connected) {
      addRealtimeMessage('Google Drive not connected. Please connect your Google account in Settings.', 'alert');
      return false;
    }
    const newUploadId = `up_${Date.now()}`;
    const newRecord = {
      id: newUploadId,
      fileName: reportName,
      type,
      date: new Date().toISOString().split('T')[0],
      sizeKb: Math.floor(Math.random() * 80) + 120,
      status: 'uploading' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setGoogleDrive(prev => ({
      ...prev,
      uploadHistory: [newRecord, ...prev.uploadHistory],
    }));

    // Realistic upload simulation
    await new Promise(r => setTimeout(r, 1200));

    setGoogleDrive(prev => ({
      ...prev,
      lastUploadTimestamp: 'Just now',
      uploadHistory: prev.uploadHistory.map(item =>
        item.id === newUploadId ? { ...item, status: 'success' } : item
      ),
    }));

    addRealtimeMessage(`Uploaded "${reportName}" to Google Drive folder "${googleDrive.folderName}".`, 'success');
    return true;
  };

  const downloadReportLocal = (reportName: string, content: string, extension: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addRealtimeMessage(`Exported ${reportName}.${extension} to local downloads.`, 'success');
  };

  const completeOnboarding = (selectedCats?: string[]) => {
    if (selectedCats && selectedCats.length > 0) {
      setSelectedCategoryIds(selectedCats);
    }
    setShowOnboarding(false);
    localStorage.setItem('dayflow_onboarding_completed', 'true');
    addRealtimeMessage('Welcome to DayFlow! Your calm schedule is ready.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        categories,
        selectedCategoryIds,
        toggleCategorySelection,
        addCategory,
        updateCategory,
        deleteCategory,
        tasks,
        originalTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        currentScreen,
        setCurrentScreen,
        editingTaskId,
        openTaskEditor,
        closeTaskEditor,
        pacingMode,
        setPacingMode,
        lowEnergyMode,
        setLowEnergyMode,
        toggleLowEnergy,
        rebalanceStrategy,
        setRebalanceStrategy,
        incidents,
        activeIncident,
        dismissIncident,
        applyRebalancePlan,
        activeFocusTask,
        focusElapsedSeconds,
        focusIsPaused,
        isFocusModalOpen,
        openFocusModal,
        closeFocusModal,
        startFocusSession,
        toggleFocusPause,
        stopFocusSession,
        runningLate,
        needBreak,
        finishCurrentEarly,
        rebuildDaySchedule,
        isDailyReviewOpen,
        openDailyReview,
        closeDailyReview,
        saveDailyReview,
        reviewHistory,
        googleDrive,
        connectGoogleDrive,
        disconnectGoogleDrive,
        uploadReportToDrive,
        downloadReportLocal,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        smartBannerDismissed,
        dismissSmartBanner,
        realtimeMessages,
        addRealtimeMessage,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
