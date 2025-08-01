export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  capacityPerDay: number; // hours or story points
  focusFactor: number; // 1.0 = full time, 0.5 = 50% etc.
  email?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  unit: 'hours' | 'story-points' | 'days';
  totalCapacity?: number;
  workingDays?: number;
  anonymousAbsences?: { [userId: number]: number }; // Additional absence days per user
  anonymousAbsences?: { [userId: number]: number }; // Additional absence days per user
  createdAt: Date;
  updatedAt: Date;
}

export interface Absence {
  id?: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'training' | 'other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  key: string;
  value: any;
}

export interface Backup {
  timestamp: number;
  data: {
    users: TeamMember[];
    sprints: Sprint[];
    absences: Absence[];
    settings: Settings[];
  };
  description?: string;
}

export interface CapacityCalculation {
  userId: number;
  userName: string;
  totalDays: number;
  workingDays: number;
  absenceDays: number;
  availableDays: number;
  rawCapacity: number;
  adjustedCapacity: number;
  focusFactor: number;
}

export interface SprintCapacity {
  sprint: Sprint;
  teamCapacity: CapacityCalculation[];
  totalCapacity: number;
  totalAvailableDays: number;
}