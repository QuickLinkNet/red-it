import React from 'react';
import { Card } from '../../../components/Card';
import { Button, Chip, LinearProgress } from '@mui/material';
import { BarChart3, Users, Calendar, TrendingUp, TrendingDown, AlertTriangle, UserCheck } from 'lucide-react';
import { SprintCapacity, TeamMember } from '../types';
import { formatCapacity, getCapacityUtilization } from '../utils/capacityCalculations';
import { getRoleDisplayName } from '../config/roles';

interface CapacityOverviewProps {
  sprintCapacity: SprintCapacity | null;
  teamMembers: TeamMember[];
  onSelectSprint: () => void;
}

export function CapacityOverview({ sprintCapacity, teamMembers, onSelectSprint }: CapacityOverviewProps) {
  if (!sprintCapacity) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Kapazitäts-Übersicht</h2>
        </div>

        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium text-white mb-2">Kein Sprint ausgewählt</h3>
          <p className="text-gray-400 mb-4">
            Wählen Sie einen Sprint aus, um die Kapazitätsberechnung zu sehen.
          </p>
          <Button
            onClick={onSelectSprint}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #8b5cf6 30%, #7c3aed 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #6d28d9 90%)',
              }
            }}
          >
            Sprint auswählen
          </Button>
        </Card>
      </div>
    );
  }

  const { sprint, teamCapacity, totalCapacity, totalAvailableDays } = sprintCapacity;

  // Calculate some statistics
  const totalTeamMembers = teamMembers.length;
  const totalWorkingDays = teamCapacity.reduce((sum, calc) => sum + calc.workingDays, 0);
  const totalAbsenceDays = teamCapacity.reduce((sum, calc) => sum + calc.absenceDays, 0);
  const averageCapacityPerMember = totalTeamMembers > 0 ? totalCapacity / totalTeamMembers : 0;
  const utilizationRate = totalWorkingDays > 0 ? (totalAvailableDays / totalWorkingDays) * 100 : 0;

  // Group capacity by roles
  const capacityByRole = teamCapacity.reduce((acc, calc) => {
    const member = teamMembers.find(m => m.id === calc.userId);
    if (member) {
      const role = getRoleDisplayName(member.role);
      if (!acc[role]) {
        acc[role] = {
          role,
          members: [],
          totalCapacity: 0,
          totalAvailableDays: 0,
          memberCount: 0,
        };
      }
      acc[role].members.push(calc);
      acc[role].totalCapacity += calc.adjustedCapacity;
      acc[role].totalAvailableDays += calc.availableDays;
      acc[role].memberCount += 1;
    }
    return acc;
  }, {} as Record<string, {
    role: string;
    members: any[];
    totalCapacity: number;
    totalAvailableDays: number;
    memberCount: number;
  }>);

  const rolesSorted = Object.values(capacityByRole).sort((a, b) => b.totalCapacity - a.totalCapacity);
  const getUtilizationColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUtilizationIcon = (rate: number) => {
    if (rate >= 90) return <TrendingUp className="h-4 w-4" />;
    if (rate >= 70) return <AlertTriangle className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Kapazitäts-Übersicht</h2>
        </div>
        <Button
          onClick={onSelectSprint}
          variant="outlined"
          size="small"
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Sprint wechseln
        </Button>
      </div>

      {/* Sprint Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{sprint.name}</h3>
          <Chip
            label={`${Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} Tage`}
            size="small"
            sx={{
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#a78bfa',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{formatCapacity(totalCapacity, sprint.unit)}</div>
            <div className="text-sm text-gray-400">Gesamt-Kapazität</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalAvailableDays}</div>
            <div className="text-sm text-gray-400">Verfügbare Tage</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{totalTeamMembers}</div>
            <div className="text-sm text-gray-400">Team-Mitglieder</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${getUtilizationColor(utilizationRate)}`}>
              {getUtilizationIcon(utilizationRate)}
              {Math.round(utilizationRate)}%
            </div>
            <div className="text-sm text-gray-400">Verfügbarkeit</div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Arbeitstage gesamt:</span>
            <span className="text-white">{totalWorkingDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Abwesenheitstage:</span>
            <span className="text-red-400">{totalAbsenceDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ø Kapazität/Mitglied:</span>
            <span className="text-white">{formatCapacity(averageCapacityPerMember, sprint.unit)}</span>
          </div>
        </div>
      </Card>

      {/* Team Capacity Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Kapazität nach Rollen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {rolesSorted.map((roleData) => (
            <div key={roleData.role} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{roleData.role}</h4>
                <Chip
                  label={`${roleData.memberCount} Mitglied${roleData.memberCount !== 1 ? 'er' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    fontSize: '0.75rem',
                    height: '20px',
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Gesamt-Kapazität:</span>
                  <span className="text-lg font-semibold text-purple-400">
                    {formatCapacity(roleData.totalCapacity, sprint.unit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Verfügbare Tage:</span>
                  <span className="text-sm text-green-400">{roleData.totalAvailableDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Ø pro Mitglied:</span>
                  <span className="text-sm text-white">
                    {formatCapacity(roleData.totalCapacity / roleData.memberCount, sprint.unit)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team-Kapazität im Detail
        </h3>

        <div className="space-y-4">
          {teamCapacity.map((calc) => {
            const member = teamMembers.find(m => m.id === calc.userId);
            const utilizationPercent = calc.workingDays > 0 ? (calc.availableDays / calc.workingDays) * 100 : 0;
            
            return (
              <div key={calc.userId} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{calc.userName}</h4>
                    {member && (
                      <p className="text-xs text-gray-400">{getRoleDisplayName(member.role)}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-purple-400">
                      {formatCapacity(calc.adjustedCapacity, sprint.unit)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {calc.focusFactor < 1 ? `${Math.round(calc.focusFactor * 100)}% Fokus` : 'Vollzeit'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arbeitstage:</span>
                    <span className="text-white">{calc.workingDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Abwesend:</span>
                    <span className="text-red-400">{calc.absenceDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verfügbar:</span>
                    <span className="text-green-400">{calc.availableDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Roh-Kapazität:</span>
                    <span className="text-white">{formatCapacity(calc.rawCapacity, sprint.unit)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Verfügbarkeit</span>
                    <span className={getUtilizationColor(utilizationPercent)}>
                      {Math.round(utilizationPercent)}%
                    </span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(utilizationPercent, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: utilizationPercent >= 90 ? '#10b981' : 
                                       utilizationPercent >= 70 ? '#f59e0b' : '#ef4444',
                        borderRadius: 3,
                      },
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Empfehlungen</h3>
        <div className="space-y-3 text-sm">
          {utilizationRate < 70 && (
            <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium">Niedrige Verfügbarkeit</p>
                <p className="text-red-400">
                  Das Team hat nur {Math.round(utilizationRate)}% Verfügbarkeit. Prüfen Sie geplante Abwesenheiten und Feiertage.
                </p>
              </div>
            </div>
          )}
          
          {totalAbsenceDays > totalWorkingDays * 0.3 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-300 font-medium">Viele Abwesenheiten</p>
                <p className="text-yellow-400">
                  {totalAbsenceDays} Abwesenheitstage könnten die Sprint-Ziele gefährden. Planen Sie entsprechend.
                </p>
              </div>
            </div>
          )}

          {utilizationRate >= 90 && (
            <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-800 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-300 font-medium">Optimale Verfügbarkeit</p>
                <p className="text-green-400">
                  Das Team hat eine sehr gute Verfügbarkeit von {Math.round(utilizationRate)}%. Ideale Bedingungen für den Sprint.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <BarChart3 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-medium">Kapazitätsplanung</p>
              <p className="text-blue-400">
                Verwenden Sie die berechnete Kapazität von {formatCapacity(totalCapacity, sprint.unit)} als Richtwert für die Sprint-Planung.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}