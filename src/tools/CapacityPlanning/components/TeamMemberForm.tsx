import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TeamMember } from '../types';
import { STANDARD_ROLES, CUSTOM_ROLE_PLACEHOLDER } from '../config/roles';

interface TeamMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  member?: TeamMember;
  title: string;
}

export function TeamMemberForm({ open, onClose, onSave, member, title }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '' as string,
    customRole: '',
    isCustomRole: false,
    capacityPerDay: 8,
    focusFactor: 1.0,
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      const isCustom = !STANDARD_ROLES.includes(member.role as any);
      setFormData({
        name: member.name,
        role: isCustom ? CUSTOM_ROLE_PLACEHOLDER : member.role,
        customRole: isCustom ? member.role : '',
        isCustomRole: isCustom,
        capacityPerDay: member.capacityPerDay,
        focusFactor: member.focusFactor,
        email: member.email || '',
        notes: member.notes || '',
      });
    } else {
      setFormData({
        name: '',
        role: '',
        customRole: '',
        isCustomRole: false,
        capacityPerDay: 8,
        focusFactor: 1.0,
        email: '',
        notes: '',
      });
    }
    setErrors({});
  }, [member, open]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (event: any) => {
    const value = event.target.value;
    const isCustom = value === CUSTOM_ROLE_PLACEHOLDER;
    
    setFormData(prev => ({ 
      ...prev, 
      role: value,
      isCustomRole: isCustom,
      customRole: isCustom ? prev.customRole : ''
    }));
    
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };
  const handleNumberChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    const finalRole = formData.isCustomRole ? formData.customRole : formData.role;
    if (!finalRole.trim()) {
      newErrors.role = 'Rolle ist erforderlich';
    }

    if (formData.isCustomRole && !formData.customRole.trim()) {
      newErrors.customRole = 'Benutzerdefinierte Rolle ist erforderlich';
    }
    if (formData.capacityPerDay <= 0) {
      newErrors.capacityPerDay = 'Kapazität muss größer als 0 sein';
    }

    if (formData.focusFactor <= 0 || formData.focusFactor > 1) {
      newErrors.focusFactor = 'Fokus-Faktor muss zwischen 0 und 1 liegen';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const finalRole = formData.isCustomRole ? formData.customRole : formData.role;
      onSave({
        ...formData,
        role: finalRole,
      });
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
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
            label="Name *"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiFormHelperText-root': { color: '#ef4444' },
            }}
          />

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel sx={{ color: 'white' }}>Rolle *</InputLabel>
            <Select
              value={formData.role}
              onChange={handleRoleChange}
              label="Rolle *"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              {STANDARD_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
              <MenuItem value={CUSTOM_ROLE_PLACEHOLDER}>
                <em>Andere...</em>
              </MenuItem>
            </Select>
            {errors.role && (
              <p className="text-red-400 text-sm mt-1">{errors.role}</p>
            )}
          </FormControl>

          {formData.isCustomRole && (
            <TextField
              label="Benutzerdefinierte Rolle"
              value={formData.customRole}
              onChange={handleChange('customRole')}
              error={!!errors.customRole}
              helperText={errors.customRole}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiFormHelperText-root': { color: '#ef4444' },
              }}
            />
          )}

          <TextField
            label="Kapazität pro Tag *"
            type="number"
            value={formData.capacityPerDay}
            onChange={handleNumberChange('capacityPerDay')}
            error={!!errors.capacityPerDay}
            helperText={errors.capacityPerDay || 'Stunden, Story Points oder Tage pro Arbeitstag'}
            inputProps={{ min: 0.1, step: 0.5 }}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiFormHelperText-root': { color: errors.capacityPerDay ? '#ef4444' : 'rgba(255, 255, 255, 0.7)' },
            }}
          />

          <TextField
            label="Fokus-Faktor *"
            type="number"
            value={formData.focusFactor}
            onChange={handleNumberChange('focusFactor')}
            error={!!errors.focusFactor}
            helperText={errors.focusFactor || '1.0 = Vollzeit, 0.5 = 50% Teilzeit, etc.'}
            inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiFormHelperText-root': { color: errors.focusFactor ? '#ef4444' : 'rgba(255, 255, 255, 0.7)' },
            }}
          />

          <TextField
            label="E-Mail"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiFormHelperText-root': { color: '#ef4444' },
            }}
          />

          <TextField
            label="Notizen"
            value={formData.notes}
            onChange={handleChange('notes')}
            multiline
            rows={3}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
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
            background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2563eb 30%, #1e40af 90%)',
            }
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}