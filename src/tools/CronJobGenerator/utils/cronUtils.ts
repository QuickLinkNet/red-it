interface CronFieldConfig {
  type: 'every' | 'even' | 'odd' | 'step' | 'specific' | 'halfMonth' | 'halfYear' | 'weekdays' | 'weekend';
  value?: number | number[];
}

interface CronConfig {
  minute: CronFieldConfig;
  hour: CronFieldConfig;
  dayOfMonth: CronFieldConfig;
  month: CronFieldConfig;
  dayOfWeek: CronFieldConfig;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  description?: string;
}

function generateCronField(field: CronFieldConfig, min: number, max: number): string {
  switch (field.type) {
    case 'every':
      return '*';
    case 'even':
      const evenValues = [];
      for (let i = min; i <= max; i++) {
        if (i % 2 === 0) evenValues.push(i);
      }
      return evenValues.join(',');
    case 'odd':
      const oddValues = [];
      for (let i = min; i <= max; i++) {
        if (i % 2 === 1) oddValues.push(i);
      }
      return oddValues.join(',');
    case 'step':
      return `*/${field.value}`;
    case 'halfMonth':
      return '1,16';
    case 'halfYear':
      return '1,7';
    case 'weekdays':
      return '1-5';
    case 'weekend':
      return '0,6';
    case 'specific':
      if (Array.isArray(field.value)) {
        return field.value.join(',');
      }
      return field.value?.toString() || '*';
    default:
      return '*';
  }
}

export function generateCronExpression(config: CronConfig): string {
  const minute = generateCronField(config.minute, 0, 59);
  const hour = generateCronField(config.hour, 0, 23);
  const dayOfMonth = generateCronField(config.dayOfMonth, 1, 31);
  const month = generateCronField(config.month, 1, 12);
  const dayOfWeek = generateCronField(config.dayOfWeek, 0, 6);
  
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

function parseCronField(field: string, min: number, max: number): CronFieldConfig {
  if (field === '*') {
    return { type: 'every' };
  }
  
  // Check for special patterns first
  if (field === '1,16') return { type: 'halfMonth' };
  if (field === '1,7') return { type: 'halfYear' };
  if (field === '1-5') return { type: 'weekdays' };
  if (field === '0,6') return { type: 'weekend' };
  
  if (field.startsWith('*/')) {
    const step = parseInt(field.substring(2));
    return { type: 'step', value: step };
  }
  
  if (field.includes('-')) {
    const [start, end] = field.split('-');
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    const values = [];
    for (let i = startNum; i <= endNum; i++) {
      values.push(i);
    }
    return { type: 'specific', value: values };
  }
  
  if (field.includes(',')) {
    const values = field.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    
    // Check if it's even numbers
    const isEven = values.every(v => v % 2 === 0) && values.length > 1;
    if (isEven) {
      const expectedEven = [];
      for (let i = min; i <= max; i += 2) {
        if (i % 2 === 0) expectedEven.push(i);
      }
      if (values.length === expectedEven.length && values.every(v => expectedEven.includes(v))) {
        return { type: 'even' };
      }
    }
    
    // Check if it's odd numbers
    const isOdd = values.every(v => v % 2 === 1) && values.length > 1;
    if (isOdd) {
      const expectedOdd = [];
      for (let i = min; i <= max; i++) {
        if (i % 2 === 1) expectedOdd.push(i);
      }
      if (values.length === expectedOdd.length && values.every(v => expectedOdd.includes(v))) {
        return { type: 'odd' };
      }
    }
    
    return { type: 'specific', value: values };
  }
  
  const singleValue = parseInt(field);
  if (!isNaN(singleValue)) {
    return { type: 'specific', value: [singleValue] };
  }
  
  return { type: 'every' };
}

export function parseCronExpression(expression: string): CronConfig | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  return {
    minute: parseCronField(minute, 0, 59),
    hour: parseCronField(hour, 0, 23),
    dayOfMonth: parseCronField(dayOfMonth, 1, 31),
    month: parseCronField(month, 1, 12),
    dayOfWeek: parseCronField(dayOfWeek, 0, 6)
  };
}

export function validateCronExpression(expression: string): ValidationResult {
  const parts = expression.trim().split(/\s+/);
  
  if (parts.length !== 5) {
    return {
      isValid: false,
      error: 'Cron-Ausdruck muss genau 5 Teile haben (Minute Stunde Tag Monat Wochentag)'
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  if (!isValidCronField(minute, 0, 59)) {
    return { isValid: false, error: 'Ungültige Minute. Erlaubt: 0-59, *, */n, n-m, n,m' };
  }

  if (!isValidCronField(hour, 0, 23)) {
    return { isValid: false, error: 'Ungültige Stunde. Erlaubt: 0-23, *, */n, n-m, n,m' };
  }

  if (!isValidCronField(dayOfMonth, 1, 31)) {
    return { isValid: false, error: 'Ungültiger Tag des Monats. Erlaubt: 1-31, *, */n, n-m, n,m' };
  }

  if (!isValidCronField(month, 1, 12)) {
    return { isValid: false, error: 'Ungültiger Monat. Erlaubt: 1-12, *, */n, n-m, n,m' };
  }

  if (!isValidCronField(dayOfWeek, 0, 7)) {
    return { isValid: false, error: 'Ungültiger Wochentag. Erlaubt: 0-7 (0,7=Sonntag), *, */n, n-m, n,m' };
  }

  return { isValid: true, description: generateDescription(expression) };
}

function isValidCronField(field: string, min: number, max: number): boolean {
  if (field === '*') return true;

  if (field.startsWith('*/')) {
    const step = parseInt(field.substring(2));
    return !isNaN(step) && step > 0 && step <= max;
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-').map(n => parseInt(n));
    return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
  }

  if (field.includes(',')) {
    const values = field.split(',').map(n => parseInt(n));
    return values.every(val => !isNaN(val) && val >= min && val <= max);
  }

  const value = parseInt(field);
  return !isNaN(value) && value >= min && value <= max;
}

function generateDescription(expression: string): string {
  const parts = expression.split(' ');
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  let description = '';
  let timeDescription = '';
  let frequencyDescription = '';
  let dayRestrictions = [];

  if (minute === '*' && hour === '*') {
    frequencyDescription = 'jede Minute';
  } else if (minute !== '*' && hour === '*') {
    if (minute.startsWith('*/')) {
      const interval = minute.substring(2);
      frequencyDescription = `alle ${interval} Minuten jeder Stunde`;
    } else {
      frequencyDescription = `jede Stunde bei Minute ${minute}`;
    }
  } else if (minute.startsWith('*/')) {
    const interval = minute.substring(2);
    if (hour === '*') {
      frequencyDescription = `alle ${interval} Minuten`;
    } else {
      const hourStr = hour.padStart(2, '0');
      frequencyDescription = `alle ${interval} Minuten ab ${hourStr}:00`;
    }
  } else if (hour.startsWith('*/')) {
    const interval = hour.substring(2);
    const minuteStr = minute.padStart(2, '0');
    frequencyDescription = `alle ${interval} Stunden um Minute ${minuteStr}`;
  } else {
    const timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    timeDescription = `um ${timeStr}`;
    frequencyDescription = 'täglich';
  }

  if (dayOfWeek !== '*') {
    if (dayOfWeek === '1-5') {
      dayRestrictions.push('an Werktagen (Montag-Freitag)');
    } else if (dayOfWeek === '6,0' || dayOfWeek === '0,6') {
      dayRestrictions.push('am Wochenende (Samstag-Sonntag)');
    } else if (dayOfWeek === '0' || dayOfWeek === '7') {
      dayRestrictions.push('sonntags');
    } else {
      dayRestrictions.push(`an Wochentag ${dayOfWeek}`);
    }
  }

  if (dayOfMonth !== '*') {
    if (dayOfMonth === '1') {
      dayRestrictions.push('am ersten Tag des Monats');
    } else if (dayOfMonth === '1,16') {
      dayRestrictions.push('am 1. und 16. Tag des Monats');
    } else {
      dayRestrictions.push(`am ${dayOfMonth}. Tag des Monats`);
    }
  }

  if (month !== '*') {
    if (month === '1,7') {
      dayRestrictions.push('im Januar und Juli');
    } else {
      dayRestrictions.push(`im Monat ${month}`);
    }
  }

  description = 'Läuft ';
  
  if (timeDescription && frequencyDescription !== 'täglich') {
    description += `${frequencyDescription} ${timeDescription}`;
  } else if (timeDescription) {
    description += `${frequencyDescription} ${timeDescription}`;
  } else {
    description += frequencyDescription;
  }
  
  if (dayRestrictions.length > 0) {
    description += ' ' + dayRestrictions.join(' ');
  }

  return description;
}

export function getNextExecutions(expression: string, count: number = 5): Date[] {
  const executions: Date[] = [];
  const now = new Date();
  let current = new Date(now.getTime() + 60000);
  current.setSeconds(0, 0);

  const parts = expression.split(' ');

  for (let i = 0; i < 130000 && executions.length < count; i++) {
    if (matchesCronExpression(current, parts)) {
      executions.push(new Date(current));
    }
    current = new Date(current.getTime() + 60000);
  }

  return executions;
}

function matchesCronExpression(date: Date, parts: string[]): boolean {
  if (parts.length !== 5) return false;
  
  const [minutePart, hourPart, dayOfMonthPart, monthPart, dayOfWeekPart] = parts;

  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return (
    matchesCronField(minute, minutePart, 0, 59) &&
    matchesCronField(hour, hourPart, 0, 23) &&
    matchesCronField(dayOfMonth, dayOfMonthPart, 1, 31) &&
    matchesCronField(month, monthPart, 1, 12) &&
    matchesCronField(dayOfWeek, dayOfWeekPart, 0, 7)
  );
}

function matchesCronField(value: number, field: string, min: number, max: number): boolean {
  if (field === '*') return true;

  if (field.includes('/')) {
    const [range, stepStr] = field.split('/');
    const step = parseInt(stepStr);
    
    if (range === '*') {
      return (value - min) % step === 0;
    } else {
      const start = parseInt(range);
      return value >= start && (value - start) % step === 0;
    }
  }

  if (field.includes('-')) {
    const [startStr, endStr] = field.split('-');
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    
    if (max === 7) {
      const normalizedValue = value === 7 ? 0 : value;
      const normalizedStart = start === 7 ? 0 : start;
      const normalizedEnd = end === 7 ? 0 : end;
      
      if (normalizedStart <= normalizedEnd) {
        return normalizedValue >= normalizedStart && normalizedValue <= normalizedEnd;
      } else {
        return normalizedValue >= normalizedStart || normalizedValue <= normalizedEnd;
      }
    }
    
    return value >= start && value <= end;
  }

  if (field.includes(',')) {
    const values = field.split(',').map(v => parseInt(v.trim()));
    
    if (max === 7) {
      return values.some(v => {
        const normalizedV = v === 7 ? 0 : v;
        const normalizedValue = value === 7 ? 0 : value;
        return normalizedValue === normalizedV;
      });
    }
    
    return values.includes(value);
  }

  const fieldValue = parseInt(field);
  
  if (max === 7) {
    const normalizedField = fieldValue === 7 ? 0 : fieldValue;
    const normalizedValue = value === 7 ? 0 : value;
    return normalizedValue === normalizedField;
  }

  return value === fieldValue;
}