import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { Expand as ExpandMore, UserMinus } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { Sprint, TeamMember } from '../types';

interface SprintFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  sprint?: Sprint;
  title: string;
  defaultSprintLength?: number;
  defaultUnit?: string;
  teamMembers?: TeamMember[];
}

export function SprintForm({ 
  open, 
  onClose, 
  onSave, 
  sprint, 
  title, 
  defaultSprintLength = 14,
  defaultUnit = 'hours',
  teamMembers = []
}: SprintFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    unit: 'hours' as 'hours' | 'story-points' | 'days',
  });
  const [anonymousAbsences, setAnonymousAbsences] = useState<{ [userId: number]: number }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sprint) {
      setFormData({
        name: sprint.name,
        startDate: format(new Date(sprint.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(sprint.endDate), 'yyyy-MM-dd'),
        unit: sprint.unit,
      });
      setAnonymousAbsences(sprint.anonymousAbsences || {});
    } else {
      const today = new Date();
      const endDate = addDays(today, defaultSprintLength - 1);
      
      setFormData({
        name: '',
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        unit: defaultUnit as 'hours' | 'story-points' | 'days',
      });
      setAnonymousAbsences({});
    }
    setErrors({});
  }, [sprint, open, defaultSprintLength, defaultUnit]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-adjust end date when start date changes
    if (field === 'startDate' && value) {
      const startDate = new Date(value);
      const currentEndDate = new Date(formData.endDate);
      const currentDuration = Math.ceil((currentEndDate.getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (currentDuration > 0 && currentDuration <= 30) {
        const newEndDate = addDays(startDate, currentDuration);
        setFormData(prev => ({ ...prev, endDate: format(newEndDate, 'yyyy-MM-dd') }));
      }
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

    if (!formData.name.trim()) {
      newErrors.name = 'Sprint-Name ist erforderlich';
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
      
      if (endDate <= startDate) {
        newErrors.endDate = 'Enddatum muss nach dem Startdatum liegen';
      }

      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (durationDays > 30) {
        newErrors.endDate = 'Sprint-Dauer sollte nicht länger als 30 Tage sein';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnonymousAbsenceChange = (userId: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAnonymousAbsences(prev => ({
      ...prev,
      [userId]: Math.max(0, numValue)
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      const sprintData = {
        name: formData.name.trim(),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        unit: formData.unit,
        anonymousAbsences: Object.keys(anonymousAbsences).length > 0 ? anonymousAbsences : undefined,
      };
      onSave(sprintData);
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

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'hours': return 'Stunden';
      case 'story-points': return 'Story Points';
      case 'days': return 'Tage';
      default: return unit;
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
          <TextField
            label="Sprint-Name *"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="z.B. Sprint 1, Release 2.1, etc."
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#10b981' },
              },
              '& .MuiFormHelperText-root': { color: '#ef4444' },
            }}
          />

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
                  '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                  '&.Mui-focused fieldset': { borderColor: '#10b981' },
                },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />
          </div>

          {getDurationDays() > 0 && (
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                <strong>Sprint-Dauer:</strong> {getDurationDays()} Tage
              </p>
            </div>
          )}

          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Kapazitäts-Einheit</InputLabel>
            <Select
              value={formData.unit}
              onChange={handleSelectChange('unit')}
              label="Kapazitäts-Einheit"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="hours">Stunden</MenuItem>
              <MenuItem value="story-points">Story Points</MenuItem>
              <MenuItem value="days">Tage</MenuItem>
            </Select>
          </FormControl>

          {/* Anonymous Absences Section */}
          {teamMembers.length > 0 && (
            <Accordion 
              sx={{ 
                backgroundColor: '#374151',
                color: 'white',
                '&:before': { display: 'none' },
                boxShadow: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px !important',
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                sx={{ 
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                }}
              >
                <div className="flex items-center gap-2">
                  <UserMinus className="h-4 w-4" />
                  <Typography sx={{ color: 'white', fontWeight: 500 }}>
                    Zusätzliche Abwesenheitstage (Optional)
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#374151', pt: 0 }}>
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 mb-4">
                    Planen Sie zusätzliche Abwesenheitstage für unvorhergesehene Ausfälle ein.
                  </p>
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span className="text-white text-sm">{member.name}</span>
                      <TextField
                        type="number"
                        size="small"
                        value={anonymousAbsences[member.id!] || 0}
                        onChange={(e) => handleAnonymousAbsenceChange(member.id!, e.target.value)}
                        inputProps={{ min: 0, max: 30, step: 0.5 }}
                        sx={{
                          width: '80px',
                          '& .MuiInputBase-input': { 
                            color: 'white', 
                            fontSize: '0.875rem',
                            textAlign: 'center'
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#10b981' },
                          },
                        }}
                      />
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Hinweise zur Sprint-Planung</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Empfohlene Sprint-Dauer: 1-4 Wochen (7-28 Tage)</li>
              <li>• Die Kapazitäts-Einheit sollte teamweit einheitlich verwendet werden</li>
              <li>• Berücksichtigen Sie Feiertage und geplante Abwesenheiten</li>
              <li>• Zusätzliche Abwesenheitstage helfen bei der realistischen Planung</li>
            </ul>
          </div>
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
            background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
            }
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}