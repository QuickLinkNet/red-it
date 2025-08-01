import React from 'react';
import { TextField } from '@mui/material';
import { CronFieldOptions } from './CronFieldOptions';

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

interface CronInputProps {
  mode: 'visual' | 'manual';
  cronExpression: string;
  cronConfig: CronConfig;
  onExpressionChange: (expression: string) => void;
  onConfigChange: (config: CronConfig) => void;
}

const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
const hourOptions = Array.from({ length: 24 }, (_, i) => i);
const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => i + 1);
const monthOptions = Array.from({ length: 12 }, (_, i) => ({ 
  value: i + 1, 
  label: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][i] 
}));
const dayOfWeekOptions = [
  { value: 0, label: 'Sonntag' },
  { value: 1, label: 'Montag' },
  { value: 2, label: 'Dienstag' },
  { value: 3, label: 'Mittwoch' },
  { value: 4, label: 'Donnerstag' },
  { value: 5, label: 'Freitag' },
  { value: 6, label: 'Samstag' }
];

export function CronInput({
  mode,
  cronExpression,
  cronConfig,
  onExpressionChange,
  onConfigChange
}: CronInputProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFieldChange = (fieldName: keyof CronConfig, field: CronFieldConfig) => {
    const newConfig = { ...cronConfig, [fieldName]: field };
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-6">
      {mode === 'visual' ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Visueller Editor</h3>
            <div className="text-sm text-gray-400">
              {cronExpression ? formatBytes(new Blob([cronExpression]).size) : '0 Bytes'}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <CronFieldOptions
                title="Minuten"
                field={cronConfig.minute}
                options={minuteOptions}
                stepOptions={[
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' },
                  { value: 30, label: '30' }
                ]}
                fieldType="minute"
                onChange={(field) => handleFieldChange('minute', field)}
              />
              
              <CronFieldOptions
                title="Stunden"
                field={cronConfig.hour}
                options={hourOptions}
                stepOptions={[
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 6, label: '6' },
                  { value: 12, label: '12' }
                ]}
                fieldType="hour"
                onChange={(field) => handleFieldChange('hour', field)}
              />
              
              <CronFieldOptions
                title="Tage des Monats"
                field={cronConfig.dayOfMonth}
                options={dayOfMonthOptions}
                stepOptions={[
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                  { value: 7, label: '7' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' }
                ]}
                fieldType="dayOfMonth"
                onChange={(field) => handleFieldChange('dayOfMonth', field)}
              />
              
              <CronFieldOptions
                title="Monate"
                field={cronConfig.month}
                options={monthOptions}
                stepOptions={[
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 6, label: '6' }
                ]}
                fieldType="month"
                onChange={(field) => handleFieldChange('month', field)}
              />
              
              <CronFieldOptions
                title="Wochentage"
                field={cronConfig.dayOfWeek}
                options={dayOfWeekOptions}
                stepOptions={[
                  { value: 2, label: '2' },
                  { value: 3, label: '3' }
                ]}
                fieldType="dayOfWeek"
                onChange={(field) => handleFieldChange('dayOfWeek', field)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Cron Expression</h3>
            <div className="text-sm text-gray-400">
              {cronExpression ? formatBytes(new Blob([cronExpression]).size) : '0 Bytes'}
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Cron Expression"
                value={cronExpression}
                onChange={(e) => onExpressionChange(e.target.value)}
                placeholder="0 9 * * 1-5"
                sx={{
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                }}
              />
              <div className="text-sm text-gray-400 font-mono bg-gray-900 p-3 rounded">
                Format: Minute Stunde Tag Monat Wochentag
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}