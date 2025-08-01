import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { format } from 'date-fns';
import { TeamMember, Absence } from '../types';

interface AbsenceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => void;
  absence?: Absence;
  title: string;
  teamMembers: TeamMember[];
}

export function AbsenceForm({ open, onClose, onSave, absence, title, teamMembers }: AbsenceFormProps) {
  const [formData, setFormData] = useState({
    userId: 0,
    startDate: '',
    endDate: '',
    type: 'vacation' as 'vacation' | 'sick' | 'training' | 'other',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (absence) {
      setFormData({
        userId: absence.userId,
        startDate: format(new Date(absence.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(absence.endDate), 'yyyy-MM-dd'),
        type: absence.type,
        description: absence.description || '',
      });
    } else {
      const today = new Date();
      setFormData({
        userId: teamMembers.length > 0 ? teamMembers[0].id! : 0,
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
        type: 'vacation',
        description: '',
      });
    }
    setErrors({});
  }, [absence, open, teamMembers]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-adjust end date when start date changes (for single day events)
    if (field === 'startDate' && value && formData.startDate === formData.endDate) {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId || formData.userId === 0) {
      newErrors.userId = 'Bitte wählen Sie ein Team-Mitglied aus';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Startdatum ist erforderlich';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Enddatum ist erforderlich';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'Enddatum darf nicht vor dem Startdatum liegen';
      }

      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (durationDays > 365) {
        newErrors.endDate = 'Abwesenheit darf nicht länger als 365 Tage sein';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const absenceData = {
        userId: formData.userId,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        type: formData.type,
        description: formData.description.trim() || undefined,
      };
      onSave(absenceData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getDurationDays = (): number => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'vacation': return 'Urlaub';
      case 'sick': return 'Krankheit';
      case 'training': return 'Schulung/Training';
      case 'other': return 'Sonstiges';
      default: return type;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'vacation': return '#3b82f6';
      case 'sick': return '#ef4444';
      case 'training': return '#8b5cf6';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1f2937',
          color: 'white',
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#1f2937' }}>
        <div className="space-y-4 pt-4">
          <FormControl fullWidth error={!!errors.userId}>
            <InputLabel sx={{ color: 'white' }}>Team-Mitglied *</InputLabel>
            <Select
              value={formData.userId}
              onChange={handleSelectChange('userId')}
              label="Team-Mitglied *"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </MenuItem>
              ))}
            </Select>
            {errors.userId && (
              <p className="text-red-400 text-sm mt-1">{errors.userId}</p>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Art der Abwesenheit</InputLabel>
            <Select
              value={formData.type}
              onChange={handleSelectChange('type')}
              label="Art der Abwesenheit"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="vacation">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor('vacation') }} />
                  {getTypeLabel('vacation')}
                </div>
              </MenuItem>
              <MenuItem value="sick">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor('sick') }} />
                  {getTypeLabel('sick')}
                </div>
              </MenuItem>
              <MenuItem value="training">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor('training') }} />
                  {getTypeLabel('training')}
                </div>
              </MenuItem>
              <MenuItem value="other">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor('other') }} />
                  {getTypeLabel('other')}
                </div>
              </MenuItem>
            </Select>
          </FormControl>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Startdatum *"
              type="date"
              value={formData.startDate}
              onChange={handleChange('startDate')}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />

            <TextField
              label="Enddatum *"
              type="date"
              value={formData.endDate}
              onChange={handleChange('endDate')}
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />
          </div>

          {getDurationDays() > 0 && (
            <div className="rounded-lg p-3" style={{ backgroundColor: `${getTypeColor(formData.type)}20`, border: `1px solid ${getTypeColor(formData.type)}40` }}>
              <p className="text-sm" style={{ color: getTypeColor(formData.type) }}>
                <strong>Dauer:</strong> {getDurationDays()} Tag{getDurationDays() !== 1 ? 'e' : ''}
              </p>
            </div>
          )}

          <TextField
            label="Beschreibung/Notizen"
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
            placeholder="Optionale Beschreibung oder Notizen..."
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
              },
            }}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#1f2937', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={handleClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Abbrechen
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #d97706 30%, #b45309 90%)',
            }
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}