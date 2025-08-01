import { format, isWeekend, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { TeamMember, Sprint, Absence, CapacityCalculation, SprintCapacity } from '../types';

// German holidays (can be extended or made configurable)
const GERMAN_HOLIDAYS_2024 = [
  '2024-01-01', // Neujahr
  '2024-03-29', // Karfreitag
  '2024-04-01', // Ostermontag
  '2024-05-01', // Tag der Arbeit
  '2024-05-09', // Christi Himmelfahrt
  '2024-05-20', // Pfingstmontag
  '2024-10-03', // Tag der Deutschen Einheit
  '2024-12-25', // 1. Weihnachtsfeiertag
  '2024-12-26', // 2. Weihnachtsfeiertag
];

const GERMAN_HOLIDAYS_2025 = [
  '2025-01-01', // Neujahr
  '2025-04-18', // Karfreitag
  '2025-04-21', // Ostermontag
  '2025-05-01', // Tag der Arbeit
  '2025-05-29', // Christi Himmelfahrt
  '2025-06-09', // Pfingstmontag
  '2025-10-03', // Tag der Deutschen Einheit
  '2025-12-25', // 1. Weihnachtsfeiertag
  '2025-12-26', // 2. Weihnachtsfeiertag
];

const ALL_HOLIDAYS = [...GERMAN_HOLIDAYS_2024, ...GERMAN_HOLIDAYS_2025];

export function isHoliday(date: Date, holidays: string[] = ALL_HOLIDAYS): boolean {
  const dateString = format(date, 'yyyy-MM-dd');
  return holidays.includes(dateString);
}

export function getWorkingDays(startDate: Date, endDate: Date, holidays: string[] = ALL_HOLIDAYS): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.filter(day => {
    return !isWeekend(day) && !isHoliday(day, holidays);
  }).length;
}

export function getAbsenceDaysInPeriod(
  absence: Absence,
  periodStart: Date,
  periodEnd: Date,
  holidays: string[] = ALL_HOLIDAYS
): number {
  const absenceStart = new Date(absence.startDate);
  const absenceEnd = new Date(absence.endDate);
  
  // Check if absence overlaps with period
  if (absenceEnd < periodStart || absenceStart > periodEnd) {
    return 0;
  }
  
  // Calculate overlap period
  const overlapStart = absenceStart > periodStart ? absenceStart : periodStart;
  const overlapEnd = absenceEnd < periodEnd ? absenceEnd : periodEnd;
  
  return getWorkingDays(overlapStart, overlapEnd, holidays);
}

export function calculateMemberCapacity(
  member: TeamMember,
  sprint: Sprint,
  absences: Absence[],
  holidays: string[] = ALL_HOLIDAYS
): CapacityCalculation {
  const sprintStart = new Date(sprint.startDate);
  const sprintEnd = new Date(sprint.endDate);
  
  // Calculate total days in sprint
  const totalDays = eachDayOfInterval({ start: sprintStart, end: sprintEnd }).length;
  
  // Calculate working days (excluding weekends and holidays)
  const workingDays = getWorkingDays(sprintStart, sprintEnd, holidays);
  
  // Calculate absence days for this member
  const memberAbsences = absences.filter(absence => absence.userId === member.id);
  let absenceDays = memberAbsences.reduce((total, absence) => {
    return total + getAbsenceDaysInPeriod(absence, sprintStart, sprintEnd, holidays);
  }, 0);
  
  // Add anonymous absence days if configured for this sprint
  if (sprint.anonymousAbsences && member.id && sprint.anonymousAbsences[member.id]) {
    absenceDays += sprint.anonymousAbsences[member.id];
  }
  
  // Calculate available days
  const availableDays = Math.max(0, workingDays - absenceDays);
  
  // Calculate raw capacity (before focus factor)
  const rawCapacity = availableDays * member.capacityPerDay;
  
  // Apply focus factor
  const adjustedCapacity = rawCapacity * member.focusFactor;
  
  return {
    userId: member.id!,
    userName: member.name,
    totalDays,
    workingDays,
    absenceDays,
    availableDays,
    rawCapacity,
    adjustedCapacity,
    focusFactor: member.focusFactor,
  };
}

export function calculateSprintCapacity(
  sprint: Sprint,
  teamMembers: TeamMember[],
  absences: Absence[],
  holidays: string[] = ALL_HOLIDAYS
): SprintCapacity {
  const teamCapacity = teamMembers.map(member => 
    calculateMemberCapacity(member, sprint, absences, holidays)
  );
  
  const totalCapacity = teamCapacity.reduce((sum, calc) => sum + calc.adjustedCapacity, 0);
  const totalAvailableDays = teamCapacity.reduce((sum, calc) => sum + calc.availableDays, 0);
  
  return {
    sprint,
    teamCapacity,
    totalCapacity,
    totalAvailableDays,
  };
}

export function formatCapacity(capacity: number, unit: string): string {
  const rounded = Math.round(capacity * 10) / 10;
  
  switch (unit) {
    case 'hours':
      return `${rounded} h`;
    case 'days':
      return `${rounded} Tage`;
    case 'story-points':
      return `${rounded} SP`;
    default:
      return `${rounded}`;
  }
}

export function formatDate(date: Date): string {
  return format(date, 'dd.MM.yyyy', { locale: de });
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getCapacityUtilization(usedCapacity: number, totalCapacity: number): {
  percentage: number;
  status: 'low' | 'optimal' | 'high' | 'overcommitted';
} {
  const percentage = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
  
  let status: 'low' | 'optimal' | 'high' | 'overcommitted';
  if (percentage <= 60) {
    status = 'low';
  } else if (percentage <= 85) {
    status = 'optimal';
  } else if (percentage <= 100) {
    status = 'high';
  } else {
    status = 'overcommitted';
  }
  
  return { percentage, status };
}