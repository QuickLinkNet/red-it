import React, { useState } from 'react';
import { Button, IconButton, Chip } from '@mui/material';
import { Edit, Trash2, Plus, CalendarOff, User } from 'lucide-react';
import { Card } from '../../../components/Card';
import { TeamMember, Absence } from '../types';
import { AbsenceForm } from './AbsenceForm';
import { formatDate, formatDateRange } from '../utils/capacityCalculations';

interface AbsencesListProps {
  absences: Absence[];
  teamMembers: TeamMember[];
  onAdd: (absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: number, absence: Partial<Absence>) => void;
  onDelete: (id: number) => void;
}

export function AbsencesList({ absences, teamMembers, onAdd, onUpdate, onDelete }: AbsencesListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | undefined>();

  const handleAdd = () => {
    setEditingAbsence(undefined);
    setFormOpen(true);
  };

  const handleEdit = (absence: Absence) => {
    setEditingAbsence(absence);
    setFormOpen(true);
  };

  const handleSave = (absenceData: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAbsence) {
      onUpdate(editingAbsence.id!, absenceData);
    } else {
      onAdd(absenceData);
    }
  };

  const handleDelete = (absence: Absence) => {
    const member = teamMembers.find(m => m.id === absence.userId);
    const memberName = member ? member.name : 'Unbekannt';
    
    if (window.confirm(`Möchten Sie die Abwesenheit von ${memberName} wirklich löschen?`)) {
      onDelete(absence.id!);
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'vacation': return 'Urlaub';
      case 'sick': return 'Krankheit';
      case 'training': return 'Schulung';
      case 'other': return 'Sonstiges';
      default: return type;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'vacation': return 'bg-blue-900/30 text-blue-300 border-blue-800';
      case 'sick': return 'bg-red-900/30 text-red-300 border-red-800';
      case 'training': return 'bg-purple-900/30 text-purple-300 border-purple-800';
      case 'other': return 'bg-gray-900/30 text-gray-300 border-gray-800';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-800';
    }
  };

  const getDurationDays = (absence: Absence): number => {
    const startDate = new Date(absence.startDate);
    const endDate = new Date(absence.endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getAbsenceStatus = (absence: Absence): { status: string; color: string } => {
    const now = new Date();
    const startDate = new Date(absence.startDate);
    const endDate = new Date(absence.endDate);

    if (now < startDate) {
      return { status: 'Geplant', color: 'bg-blue-900/30 text-blue-300 border-blue-800' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Aktiv', color: 'bg-orange-900/30 text-orange-300 border-orange-800' };
    } else {
      return { status: 'Vergangen', color: 'bg-gray-900/30 text-gray-300 border-gray-800' };
    }
  };

  // Sort absences by start date (newest first)
  const sortedAbsences = [...absences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Group absences by team member
  const absencesByMember = teamMembers.map(member => ({
    member,
    absences: sortedAbsences.filter(absence => absence.userId === member.id),
  })).filter(group => group.absences.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarOff className="h-6 w-6 text-amber-400" />
          <h2 className="text-xl font-semibold text-white">Abwesenheiten</h2>
          <Chip 
            label={`${absences.length} Einträge`}
            size="small"
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          />
        </div>
        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<Plus className="h-4 w-4" />}
          disabled={teamMembers.length === 0}
          sx={{
            background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #d97706 30%, #b45309 90%)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Abwesenheit hinzufügen
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">Keine Team-Mitglieder</h3>
          <p className="text-gray-400">
            Fügen Sie zuerst Team-Mitglieder hinzu, bevor Sie Abwesenheiten erfassen können.
          </p>
        </Card>
      ) : absences.length === 0 ? (
        <Card className="p-8 text-center">
          <CalendarOff className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">Noch keine Abwesenheiten</h3>
          <p className="text-gray-400 mb-4">
            Erfassen Sie Urlaub, Krankheit oder andere Abwesenheiten Ihrer Team-Mitglieder.
          </p>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={<Plus className="h-4 w-4" />}
            sx={{
              background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #d97706 30%, #b45309 90%)',
              }
            }}
          >
            Erste Abwesenheit hinzufügen
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {absencesByMember.map(({ member, absences: memberAbsences }) => (
            <Card key={member.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <span className="text-sm text-gray-400">({member.role})</span>
                <Chip 
                  label={`${memberAbsences.length} Abwesenheit${memberAbsences.length !== 1 ? 'en' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '0.75rem',
                    height: '20px',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {memberAbsences.map((absence) => {
                  const status = getAbsenceStatus(absence);
                  
                  return (
                    <div key={absence.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Chip
                              label={getTypeLabel(absence.type)}
                              size="small"
                              sx={{
                                fontSize: '0.75rem',
                                height: '18px',
                              }}
                              className={getTypeColor(absence.type)}
                            />
                            <Chip
                              label={status.status}
                              size="small"
                              sx={{
                                fontSize: '0.75rem',
                                height: '18px',
                              }}
                              className={status.color}
                            />
                          </div>
                          <p className="text-sm text-white font-medium">
                            {formatDateRange(new Date(absence.startDate), new Date(absence.endDate))}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getDurationDays(absence)} Tag{getDurationDays(absence) !== 1 ? 'e' : ''}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(absence)}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#f59e0b' } }}
                          >
                            <Edit className="h-3 w-3" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(absence)}
                            sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ef4444' } }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </IconButton>
                        </div>
                      </div>

                      {absence.description && (
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {absence.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AbsenceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        absence={editingAbsence}
        title={editingAbsence ? 'Abwesenheit bearbeiten' : 'Neue Abwesenheit hinzufügen'}
        teamMembers={teamMembers}
      />
    </div>
  );
}