import React, { useState } from 'react';
import { Button, IconButton, Chip } from '@mui/material';
import { Edit, Trash2, UserPlus, Mail, Users } from 'lucide-react';
import { Card } from '../../../components/Card';
import { TeamMember } from '../types';
import { TeamMemberForm } from './TeamMemberForm';
import { getRoleDisplayName } from '../config/roles';

interface TeamMembersListProps {
  members: TeamMember[];
  onAdd: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: number, member: Partial<TeamMember>) => void;
  onDelete: (id: number) => void;
}

export function TeamMembersList({ members, onAdd, onUpdate, onDelete }: TeamMembersListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();

  const handleAdd = () => {
    setEditingMember(undefined);
    setFormOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const handleSave = (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMember) {
      onUpdate(editingMember.id!, memberData);
    } else {
      onAdd(memberData);
    }
  };

  const handleDelete = (member: TeamMember) => {
    if (window.confirm(`Möchten Sie ${member.name} wirklich löschen? Alle zugehörigen Abwesenheiten werden ebenfalls gelöscht.`)) {
      onDelete(member.id!);
    }
  };

  const getFocusFactorColor = (focusFactor: number) => {
    if (focusFactor >= 1.0) return 'bg-green-900/30 text-green-300 border-green-800';
    if (focusFactor >= 0.8) return 'bg-yellow-900/30 text-yellow-300 border-yellow-800';
    return 'bg-orange-900/30 text-orange-300 border-orange-800';
  };

  const getFocusFactorLabel = (focusFactor: number) => {
    if (focusFactor >= 1.0) return 'Vollzeit';
    return `${Math.round(focusFactor * 100)}% Teilzeit`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Team-Mitglieder</h2>
          <Chip 
            label={`${members.length} Mitglieder`}
            size="small"
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          />
        </div>
        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<UserPlus className="h-4 w-4" />}
          sx={{
            background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2563eb 30%, #1e40af 90%)',
            }
          }}
        >
          Mitglied hinzufügen
        </Button>
      </div>

      {members.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">Noch keine Team-Mitglieder</h3>
          <p className="text-gray-400 mb-4">
            Fügen Sie Ihr erstes Team-Mitglied hinzu, um mit der Kapazitätsplanung zu beginnen.
          </p>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={<UserPlus className="h-4 w-4" />}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563eb 30%, #1e40af 90%)',
              }
            }}
          >
            Erstes Mitglied hinzufügen
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{getRoleDisplayName(member.role)}</p>
                </div>
                <div className="flex gap-1">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(member)}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#3b82f6' } }}
                  >
                    <Edit className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(member)}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#ef4444' } }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Kapazität/Tag:</span>
                  <span className="text-sm text-white font-medium">{member.capacityPerDay}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Fokus:</span>
                  <Chip
                    label={getFocusFactorLabel(member.focusFactor)}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      height: '20px',
                    }}
                    className={getFocusFactorColor(member.focusFactor)}
                  />
                </div>

                {member.email && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400 truncate">{member.email}</span>
                  </div>
                )}

                {member.notes && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 line-clamp-2">{member.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <TeamMemberForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        member={editingMember}
        title={editingMember ? 'Mitglied bearbeiten' : 'Neues Mitglied hinzufügen'}
      />
    </div>
  );
}