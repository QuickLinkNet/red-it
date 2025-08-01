import React, { useState } from 'react';
import { Button, IconButton, Chip } from '@mui/material';
import { Edit, Trash2, Plus, Calendar, Clock } from 'lucide-react';
import { Card } from '../../../components/Card';
import { Sprint } from '../types';
import { SprintForm } from './SprintForm';
import { formatDate, formatDateRange } from '../utils/capacityCalculations';

interface SprintsListProps {
  sprints: Sprint[];
  teamMembers: TeamMember[];
  teamMembers: TeamMember[];
  onAdd: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: number, sprint: Partial<Sprint>) => void;
  onDelete: (id: number) => void;
  onSelect?: (sprint: Sprint) => void;
  selectedSprintId?: number;
  defaultSprintLength?: number;
  defaultUnit?: string;
}

export function SprintsList({ 
  sprints, 
  teamMembers,
  onAdd, 
  onUpdate, 
  onDelete, 
  onSelect,
  selectedSprintId,
  defaultSprintLength,
  defaultUnit
}: SprintsListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | undefined>();

  const handleAdd = () => {
    setEditingSprint(undefined);
    setFormOpen(true);
  };

  const handleEdit = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setFormOpen(true);
  };

  const handleSave = (sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSprint) {
      onUpdate(editingSprint.id!, sprintData);
    } else {
      onAdd(sprintData);
    }
  };

  const handleDelete = (sprint: Sprint) => {
    if (window.confirm(`Möchten Sie den Sprint "${sprint.name}" wirklich löschen?`)) {
      onDelete(sprint.id!);
    }
  };

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'hours': return 'Stunden';
      case 'story-points': return 'Story Points';
      case 'days': return 'Tage';
      default: return unit;
    }
  };

  const getSprintStatus = (sprint: Sprint): { status: string; color: string } => {
    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (now < startDate) {
      return { status: 'Geplant', color: 'bg-blue-900/30 text-blue-300 border-blue-800' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'Aktiv', color: 'bg-green-900/30 text-green-300 border-green-800' };
    } else {
      return { status: 'Abgeschlossen', color: 'bg-gray-900/30 text-gray-300 border-gray-800' };
    }
  };

  const getDurationDays = (sprint: Sprint): number => {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Sort sprints by start date (newest first)
  const sortedSprints = [...sprints].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Sprints</h2>
          <Chip 
            label={`${sprints.length} Sprints`}
            size="small"
            sx={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          />
        </div>
        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<Plus className="h-4 w-4" />}
          sx={{
            background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
            }
          }}
        >
          Sprint erstellen
        </Button>
      </div>

      {sprints.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">Noch keine Sprints</h3>
          <p className="text-gray-400 mb-4">
            Erstellen Sie Ihren ersten Sprint, um mit der Kapazitätsplanung zu beginnen.
          </p>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={<Plus className="h-4 w-4" />}
            sx={{
              background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
              }
            }}
          >
            Ersten Sprint erstellen
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSprints.map((sprint) => {
            const status = getSprintStatus(sprint);
            const isSelected = selectedSprintId === sprint.id;
            
            return (
              <Card 
                key={sprint.id} 
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-green-500 bg-green-900/10' : ''
                } ${onSelect ? 'hover:bg-gray-800/50' : ''}`}
                onClick={() => onSelect && onSelect(sprint)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
                    <p className="text-sm text-gray-400">{formatDateRange(new Date(sprint.startDate), new Date(sprint.endDate))}</p>
                  </div>
                  <div className="flex gap-1">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(sprint);
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#10b981' } }}
                    >
                      <Edit className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sprint);
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ef4444' } }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Status:</span>
                    <Chip
                      label={status.status}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        height: '20px',
                      }}
                      className={status.color}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Dauer:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-white">{getDurationDays(sprint)} Tage</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Einheit:</span>
                    <span className="text-sm text-white">{getUnitLabel(sprint.unit)}</span>
                  </div>

                  {sprint.totalCapacity !== undefined && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <span className="text-sm text-gray-400">Kapazität:</span>
                      <span className="text-sm text-green-400 font-medium">
                        {Math.round(sprint.totalCapacity * 10) / 10} {getUnitLabel(sprint.unit)}
                      </span>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-green-800">
                    <p className="text-xs text-green-400 text-center">
                      ✓ Ausgewählt für Kapazitätsberechnung
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <SprintForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        sprint={editingSprint}
        title={editingSprint ? 'Sprint bearbeiten' : 'Neuen Sprint erstellen'}
        defaultSprintLength={defaultSprintLength}
        defaultUnit={defaultUnit}
        teamMembers={teamMembers}
      />
    </div>
  );
}