export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'someday';
export type FlexibilityType = 'strictly_fixed' | 'time_window' | 'preferred' | 'fully_flexible';
export type EnergyState = 'deep' | 'balanced' | 'admin' | 'recovery';
export type TaskStatus = 'planned' | 'in_progress' | 'completed' | 'blocked' | 'postponed' | 'cancelled';
export type PacingMode = 'balanced' | 'deadline';
export type RebalanceStrategy = 'balanced' | 'deadline' | 'low_cog';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind hex or class identifier
  textColor: string;
  badgeBg: string;
  targetHoursPerWeek: number;
  importance: 'high' | 'medium' | 'low';
  flexibility: 'fixed' | 'flexible' | 'mixed';
  inReports: boolean;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  categoryId: string;
  urgency: UrgencyLevel;
  importance: 'high' | 'medium' | 'low';
  flexibility: FlexibilityType;
  preferredWindow?: {
    start: string; // e.g. "07:00"
    end: string;   // e.g. "11:00"
  };
  scheduledStart: string; // "06:30"
  scheduledEnd: string;   // "08:00"
  durationMinutes: number;
  actualDurationMinutes?: number;
  actualStartTime?: string;
  actualEndTime?: string;
  status: TaskStatus;
  energyRequired: EnergyState;
  minChunkMinutes: number;
  recoveryBufferMinutes: number;
  deadline?: string; // "2024-10-31"
  deadlineTime?: string; // "17:00"
  location?: string;
  isAnchor?: boolean;
  isSplitPart?: boolean;
  splitInfo?: string;
  postponedTo?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  milestone?: string;
  deviationReason?: string;
  createdAt: string;
}

export interface ScheduleIncident {
  id: string;
  title: string;
  description: string;
  deltaMinutes: number;
  detectedAt: string;
  affectedTaskIds: string[];
  resolved: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  avatarUrl: string;
  cognitivePeakWindow: string;
  termWeek: string;
  location: string;
}

export interface DailyReviewData {
  date: string;
  completedTaskIds: string[];
  unfinishedTaskDisposition: Record<string, 'tomorrow' | 'someday' | 'split' | 'dropped'>;
  deviationReason: string;
  energyRating: number; // 1-10
  recoveryAdequate: boolean;
  score: number; // 1-10
  scoreLabel: string; // "Peak Day" | "Sustainable Progress" | "Needs Adjustment" | "Overloaded" | "Recovery Priority"
  oneImprovementNote: string;
  timestamp: string;
}

export interface GoogleDriveStatus {
  connected: boolean;
  accountEmail?: string;
  folderName: string;
  autoUploadDaily: boolean;
  autoUploadWeekly: boolean;
  lastUploadTimestamp?: string;
  uploadHistory: {
    id: string;
    fileName: string;
    type: 'daily' | 'weekly';
    date: string;
    sizeKb: number;
    status: 'success' | 'uploading' | 'failed';
    timestamp: string;
  }[];
}

export interface DayMetric {
  date: string;
  tasksPlanned: number;
  tasksCompleted: number;
  plannedWorkHours: number;
  actualWorkHours: number;
  timelineAdherencePercent: number;
  deepWorkHours: number;
  recoveryBufferHours: number;
  scheduleChangesCount: number;
  selfAssessmentScore: number;
}
