import React, { useState, useEffect } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Tabs, Tab, Box, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Users, Calendar, CalendarOff, BarChart3, Settings, FileText } from 'lucide-react';
import { dbService } from './services/dbService';
import { TeamMember, Sprint, Absence, SprintCapacity } from './types';
import { TeamMembersList } from './components/TeamMembersList';
import { SprintsList } from './components/SprintsList';
import { AbsencesList } from './components/AbsencesList';
import { CapacityOverview } from './components/CapacityOverview';
import { DataManagement } from './components/DataManagement';
import { calculateSprintCapacity } from './utils/capacityCalculations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function CapacityPlanning() {
  const [activeTab, setActiveTab] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [sprintCapacity, setSprintCapacity] = useState<SprintCapacity | null>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [sprintSelectDialogOpen, setSprintSelectDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dbService.init();
        await loadAllData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        alert('Fehler beim Initialisieren der Anwendung: ' + (error as Error).message);
      }
    };

    initializeApp();
  }, []);

  // Calculate capacity when sprint or data changes
  useEffect(() => {
    if (selectedSprint && teamMembers.length > 0) {
      const capacity = calculateSprintCapacity(selectedSprint, teamMembers, absences);
      setSprintCapacity(capacity);
    } else {
      setSprintCapacity(null);
    }
  }, [selectedSprint, teamMembers, absences]);

  const loadAllData = async () => {
    try {
      const [membersData, sprintsData, absencesData, backupsData] = await Promise.all([
        dbService.getAllTeamMembers(),
        dbService.getAllSprints(),
        dbService.getAllAbsences(),
        dbService.getAllBackups(),
      ]);

      setTeamMembers(membersData);
      setSprints(sprintsData);
      setAbsences(absencesData);
      setBackups(backupsData);

      // Auto-select the most recent sprint if none is selected
      if (!selectedSprint && sprintsData.length > 0) {
        const mostRecentSprint = sprintsData.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )[0];
        setSelectedSprint(mostRecentSprint);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Team Members handlers
  const handleAddTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await dbService.addTeamMember(memberData);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Hinzufügen des Team-Mitglieds: ' + (error as Error).message);
    }
  };

  const handleUpdateTeamMember = async (id: number, memberData: Partial<TeamMember>) => {
    try {
      await dbService.updateTeamMember(id, memberData);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Aktualisieren des Team-Mitglieds: ' + (error as Error).message);
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    try {
      await dbService.deleteTeamMember(id);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Löschen des Team-Mitglieds: ' + (error as Error).message);
    }
  };

  // Sprints handlers
  const handleAddSprint = async (sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await dbService.addSprint(sprintData);
      await loadAllData();
      
      // Auto-select the newly created sprint
      const newSprint = await dbService.getSprint(id);
      if (newSprint) {
        setSelectedSprint(newSprint);
      }
    } catch (error) {
      alert('Fehler beim Erstellen des Sprints: ' + (error as Error).message);
    }
  };

  const handleUpdateSprint = async (id: number, sprintData: Partial<Sprint>) => {
    try {
      await dbService.updateSprint(id, sprintData);
      await loadAllData();
      
      // Update selected sprint if it was the one being edited
      if (selectedSprint && selectedSprint.id === id) {
        const updatedSprint = await dbService.getSprint(id);
        if (updatedSprint) {
          setSelectedSprint(updatedSprint);
        }
      }
    } catch (error) {
      alert('Fehler beim Aktualisieren des Sprints: ' + (error as Error).message);
    }
  };

  const handleDeleteSprint = async (id: number) => {
    try {
      await dbService.deleteSprint(id);
      await loadAllData();
      
      // Clear selected sprint if it was deleted
      if (selectedSprint && selectedSprint.id === id) {
        setSelectedSprint(null);
      }
    } catch (error) {
      alert('Fehler beim Löschen des Sprints: ' + (error as Error).message);
    }
  };

  // Absences handlers
  const handleAddAbsence = async (absenceData: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await dbService.addAbsence(absenceData);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Hinzufügen der Abwesenheit: ' + (error as Error).message);
    }
  };

  const handleUpdateAbsence = async (id: number, absenceData: Partial<Absence>) => {
    try {
      await dbService.updateAbsence(id, absenceData);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Aktualisieren der Abwesenheit: ' + (error as Error).message);
    }
  };

  const handleDeleteAbsence = async (id: number) => {
    try {
      await dbService.deleteAbsence(id);
      await loadAllData();
    } catch (error) {
      alert('Fehler beim Löschen der Abwesenheit: ' + (error as Error).message);
    }
  };

  // Data management handlers
  const handleExport = async (): Promise<string> => {
    return await dbService.exportData();
  };

  const handleImport = async (data: string): Promise<void> => {
    await dbService.importData(data);
    await loadAllData();
  };

  const handleCreateBackup = async (description?: string): Promise<void> => {
    await dbService.createBackup(description);
    await loadAllData();
  };

  const handleRestoreBackup = async (timestamp: number): Promise<void> => {
    await dbService.restoreBackup(timestamp);
    await loadAllData();
  };

  const handleSelectSprint = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setSprintSelectDialogOpen(false);
  };

  const openSprintSelectDialog = () => {
    setSprintSelectDialogOpen(true);
  };

  if (!isInitialized) {
    return (
      <Container className="py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Initialisiere Kapazitätsplanung...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Scrum Team Kapazitätsplanung</h1>
            <p className="text-gray-400">Planen Sie die Kapazität Ihres Teams für erfolgreiche Sprints</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Tabs */}
        <Card className="overflow-hidden">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiTabs-indicator': {
                backgroundColor: '#3b82f6',
              },
            }}
          >
            <Tab
              icon={<Users className="h-4 w-4" />}
              label="Team"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#3b82f6' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<Calendar className="h-4 w-4" />}
              label="Sprints"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#3b82f6' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<CalendarOff className="h-4 w-4" />}
              label="Abwesenheiten"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#3b82f6' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<BarChart3 className="h-4 w-4" />}
              label="Kapazität"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#3b82f6' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<FileText className="h-4 w-4" />}
              label="Daten"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#3b82f6' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
          </Tabs>

          <div className="p-6">
            <TabPanel value={activeTab} index={0}>
              <TeamMembersList
                members={teamMembers}
                onAdd={handleAddTeamMember}
                onUpdate={handleUpdateTeamMember}
                onDelete={handleDeleteTeamMember}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <SprintsList
                sprints={sprints}
                teamMembers={teamMembers}
                onAdd={handleAddSprint}
                onUpdate={handleUpdateSprint}
                onDelete={handleDeleteSprint}
                onSelect={handleSelectSprint}
                selectedSprintId={selectedSprint?.id}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <AbsencesList
                absences={absences}
                teamMembers={teamMembers}
                onAdd={handleAddAbsence}
                onUpdate={handleUpdateAbsence}
                onDelete={handleDeleteAbsence}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={3}>
              <CapacityOverview
                sprintCapacity={sprintCapacity}
                teamMembers={teamMembers}
                onSelectSprint={openSprintSelectDialog}
              />
            </TabPanel>
            
            <TabPanel value={activeTab} index={4}>
              <DataManagement
                onExport={handleExport}
                onImport={handleImport}
                onCreateBackup={handleCreateBackup}
                onRestoreBackup={handleRestoreBackup}
                backups={backups}
                onRefreshBackups={loadAllData}
              />
            </TabPanel>
          </div>
        </Card>
      </div>

      {/* Sprint Selection Dialog */}
      <Dialog 
        open={sprintSelectDialogOpen} 
        onClose={() => setSprintSelectDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1f2937',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Sprint für Kapazitätsberechnung auswählen
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1f2937' }}>
          {sprints.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Keine Sprints vorhanden. Erstellen Sie zuerst einen Sprint.</p>
            </div>
          ) : (
            <List>
              {sprints.map((sprint) => (
                <ListItem
                  key={sprint.id}
                  button
                  onClick={() => handleSelectSprint(sprint)}
                  selected={selectedSprint?.id === sprint.id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    },
                  }}
                >
                  <ListItemText
                    primary={sprint.name}
                    secondary={`${new Date(sprint.startDate).toLocaleDateString('de-DE')} - ${new Date(sprint.endDate).toLocaleDateString('de-DE')}`}
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Über die Kapazitätsplanung</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Scrum-basiert</h4>
            <p>Basiert auf offiziellen Scrum.org Empfehlungen zur Kapazitätsplanung und berücksichtigt alle wichtigen Faktoren wie Teamgröße, Fokus und Verfügbarkeit.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Offline-fähig</h4>
            <p>Alle Daten werden lokal in Ihrem Browser gespeichert (IndexedDB). Keine Server erforderlich, vollständig offline nutzbar.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Export & Backup</h4>
            <p>Exportieren Sie Ihre Daten als JSON oder erstellen Sie lokale Backups. Importieren Sie Daten zwischen verschiedenen Geräten.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}