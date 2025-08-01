import React from 'react';
import { FormControlLabel, Radio, RadioGroup, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Box, TextField } from '@mui/material';

interface CronFieldConfig {
  type: 'every' | 'even' | 'odd' | 'step' | 'specific' | 'halfMonth' | 'halfYear' | 'weekdays' | 'weekend';
  value?: number | number[];
}

interface CronFieldOptionsProps {
  title: string;
  field: CronFieldConfig;
  options: number[] | { value: number; label: string }[];
  stepOptions: { value: number; label: string }[];
  onChange: (field: CronFieldConfig) => void;
  fieldType: 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';
}

const getFieldSpecificOptions = (fieldType: string) => {
  switch (fieldType) {
    case 'minute':
      return [
        { type: 'every', label: 'Jede Minute' },
        { type: 'even', label: 'Gerade Minuten' },
        { type: 'odd', label: 'Ungerade Minuten' },
        { type: 'step', label: 'Alle' },
        { type: 'specific', label: 'Spezifische Minuten' }
      ];
    case 'hour':
      return [
        { type: 'every', label: 'Jede Stunde' },
        { type: 'even', label: 'Gerade Stunden' },
        { type: 'odd', label: 'Ungerade Stunden' },
        { type: 'step', label: 'Alle' },
        { type: 'specific', label: 'Spezifische Stunden' }
      ];
    case 'dayOfMonth':
      return [
        { type: 'every', label: 'Jeden Tag' },
        { type: 'even', label: 'Gerade Tage' },
        { type: 'odd', label: 'Ungerade Tage' },
        { type: 'step', label: 'Alle' },
        { type: 'halfMonth', label: 'Jeden halben Monat' },
        { type: 'specific', label: 'Spezifische Tage' }
      ];
    case 'month':
      return [
        { type: 'every', label: 'Jeden Monat' },
        { type: 'even', label: 'Gerade Monate' },
        { type: 'odd', label: 'Ungerade Monate' },
        { type: 'step', label: 'Alle' },
        { type: 'halfYear', label: 'Jedes halbe Jahr' },
        { type: 'specific', label: 'Spezifische Monate' }
      ];
    case 'dayOfWeek':
      return [
        { type: 'every', label: 'Jeden Tag' },
        { type: 'weekdays', label: 'Montag - Freitag' },
        { type: 'weekend', label: 'Samstag - Sonntag' },
        { type: 'specific', label: 'Spezifische Tage' }
      ];
    default:
      return [];
  }
};

export function CronFieldOptions({ 
  title, 
  field, 
  options, 
  stepOptions, 
  onChange, 
  fieldType 
}: CronFieldOptionsProps) {
  const fieldOptions = getFieldSpecificOptions(fieldType);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as CronFieldConfig['type'];
    
    if (newType === 'step') {
      onChange({ type: newType, value: stepOptions[0]?.value || 1 });
    } else if (newType === 'specific') {
      onChange({ type: newType, value: [] });
    } else if (newType === 'halfMonth') {
      onChange({ type: newType, value: [1, 16] });
    } else if (newType === 'halfYear') {
      onChange({ type: newType, value: [1, 7] });
    } else if (newType === 'weekdays') {
      onChange({ type: newType, value: [1, 2, 3, 4, 5] });
    } else if (newType === 'weekend') {
      onChange({ type: newType, value: [0, 6] });
    } else {
      onChange({ type: newType });
    }
  };

  const handleStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stepValue = parseInt(event.target.value);
    onChange({ type: 'step', value: stepValue });
  };

  const handleSpecificChange = (event: any) => {
    const values = event.target.value as number[];
    onChange({ type: 'specific', value: values });
  };

  const getSpecificValues = (): number[] => {
    if (field.type === 'specific' && Array.isArray(field.value)) {
      return field.value;
    }
    return [];
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h4 className="text-white font-medium mb-3 text-sm">{title}</h4>
      
      <RadioGroup value={field.type} onChange={handleTypeChange} className="space-y-2">
        {fieldOptions.map((option) => (
          <div key={option.type} className="flex items-center gap-2">
            <FormControlLabel
              value={option.type}
              control={<Radio size="small" sx={{ color: 'white', '&.Mui-checked': { color: '#10b981' } }} />}
              label={<span className="text-gray-300 text-sm">{option.label}</span>}
            />
            
            {field.type === 'step' && option.type === 'step' && (
              <TextField
                size="small"
                type="number"
                value={field.value || stepOptions[0]?.value || 1}
                onChange={handleStepChange}
                inputProps={{ min: 1, max: 60 }}
                sx={{
                  width: '80px',
                  '& .MuiInputBase-input': { color: 'white', fontSize: '0.875rem' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                }}
              />
            )}
          </div>
        ))}
      </RadioGroup>

      {field.type === 'specific' && (
        <div className="mt-3">
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'white', fontSize: '0.875rem' }}>Werte wählen</InputLabel>
            <Select
              multiple
              value={getSpecificValues()}
              onChange={handleSpecificChange}
              input={<OutlinedInput label="Werte wählen" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map((value) => (
                    <Chip
                      key={value}
                      label={typeof options[0] === 'object' ? 
                        (options as { value: number; label: string }[]).find(opt => opt.value === value)?.label || value :
                        value
                      }
                      size="small"
                      sx={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '0.75rem',
                        height: '20px'
                      }}
                    />
                  ))}
                </Box>
              )}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              {(typeof options[0] === 'object' ? options as { value: number; label: string }[] : 
                (options as number[]).map(opt => ({ value: opt, label: opt.toString() }))
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
}