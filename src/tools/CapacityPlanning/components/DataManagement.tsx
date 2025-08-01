import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Download, Upload, Save, RotateCcw, Trash2, FileText, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/Card';
import { Backup } from '../types';

interface DataManagementProps {
  onExport: () => Promise<string>;
  onImport: (data: string) => Promise<void>;
  onCreateBackup: (description?: string) => Promise<void>;
  onRestoreBackup: (timestamp: number) => Promise<void>;
  backups: Backup[];
  onRefreshBackups: () => void;
}

export function DataManagement({ 
  onExport, 
  onImport, 
  onCreateBackup, 
  onRestoreBackup, 
  backups,
  onRefreshBackups 
}: DataManagementProps) {
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const data = await onExport();
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capacity-planning-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Fehler beim Exportieren der Daten: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setIsProcessing(true);
          const text = await file.text();
          await onImport(text);
          alert('Daten erfolgreich importiert!');
          onRefreshBackups();
        } catch (error) {
          alert('Fehler beim Importieren der Daten: ' + (error as Error).message);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    input.click();
  };

  const handleCreateBackup = async () => {
    try {
      setIsProcessing(true);
      await onCreateBackup(`Manuelles Backup vom ${new Date().toLocaleString('de-DE')}`);
      setBackupDialogOpen(false);
      onRefreshBackups();
      alert('Backup erfolgreich erstellt!');
    } catch (error) {
      alert('Fehler beim Erstellen des Backups: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    try {
      setIsProcessing(true);
      await onRestoreBackup(selectedBackup.timestamp);
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
      alert('Backup erfolgreich wiederhergestellt!');
    } catch (error) {
      alert('Fehler beim Wiederherstellen des Backups: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBackupDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('de-DE');
  };

  const getBackupSize = (backup: Backup): string => {
    const size = JSON.stringify(backup.data).length;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">Daten-Management</h2>
      </div>

      {/* Export/Import */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export & Import</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-white">Daten exportieren</h4>
            <p className="text-sm text-gray-400">
              Exportieren Sie alle Ihre Daten (Team-Mitglieder, Sprints, Abwesenheiten) als JSON-Datei.
            </p>
            <Button
              onClick={handleExport}
              disabled={isProcessing}
              variant="contained"
              startIcon={<Download className="h-4 w-4" />}
              sx={{
                background: 'linear-gradient(45deg, #6366f1 30%, #4f46e5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #4338ca 90%)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {isProcessing ? 'Exportiere...' : 'Daten exportieren'}
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Daten importieren</h4>
            <p className="text-sm text-gray-400">
              Importieren Sie eine zuvor exportierte JSON-Datei. Achtung: Überschreibt alle vorhandenen Daten!
            </p>
            <Button
              onClick={handleImport}
              disabled={isProcessing}
              variant="outlined"
              startIcon={<Upload className="h-4 w-4" />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&:disabled': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              {isProcessing ? 'Importiere...' : 'Daten importieren'}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-300 font-medium">Wichtiger Hinweis</p>
              <p className="text-yellow-400">
                Beim Import werden alle vorhandenen Daten überschrieben. Erstellen Sie vorher ein Backup!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Backups */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Lokale Backups</h3>
          <Button
            onClick={() => setBackupDialogOpen(true)}
            disabled={isProcessing}
            variant="contained"
            startIcon={<Save className="h-4 w-4" />}
            sx={{
              background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #047857 30%, #065f46 90%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Backup erstellen
          </Button>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-8">
            <Save className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <h4 className="text-lg font-medium text-white mb-2">Keine Backups vorhanden</h4>
            <p className="text-gray-400 mb-4">
              Erstellen Sie Ihr erstes Backup, um Ihre Daten zu sichern.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {backups.slice(0, 10).map((backup) => (
              <div key={backup.timestamp} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{formatBackupDate(backup.timestamp)}</p>
                  {backup.description && (
                    <p className="text-sm text-gray-400">{backup.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {backup.data.users.length} Mitglieder, {backup.data.sprints.length} Sprints, {backup.data.absences.length} Abwesenheiten • {getBackupSize(backup)}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedBackup(backup);
                    setRestoreDialogOpen(true);
                  }}
                  disabled={isProcessing}
                  size="small"
                  startIcon={<RotateCcw className="h-3 w-3" />}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { 
                      color: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)' 
                    },
                    '&:disabled': {
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Wiederherstellen
                </Button>
              </div>
            ))}
            
            {backups.length > 10 && (
              <p className="text-sm text-gray-400 text-center pt-2">
                ... und {backups.length - 10} weitere Backups
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Create Backup Dialog */}
      <Dialog 
        open={backupDialogOpen} 
        onClose={() => setBackupDialogOpen(false)} 
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
          Backup erstellen
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1f2937' }}>
          <p className="text-gray-300 mb-4">
            Möchten Sie ein Backup aller aktuellen Daten erstellen? Das Backup wird lokal in Ihrem Browser gespeichert.
          </p>
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              Das Backup enthält alle Team-Mitglieder, Sprints, Abwesenheiten und Einstellungen.
            </p>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1f2937', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={() => setBackupDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleCreateBackup} 
            disabled={isProcessing}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #047857 30%, #065f46 90%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {isProcessing ? 'Erstelle...' : 'Backup erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Backup Dialog */}
      <Dialog 
        open={restoreDialogOpen} 
        onClose={() => setRestoreDialogOpen(false)} 
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
          Backup wiederherstellen
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1f2937' }}>
          {selectedBackup && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Möchten Sie das folgende Backup wiederherstellen?
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white font-medium">{formatBackupDate(selectedBackup.timestamp)}</p>
                {selectedBackup.description && (
                  <p className="text-gray-400">{selectedBackup.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {selectedBackup.data.users.length} Mitglieder, {selectedBackup.data.sprints.length} Sprints, {selectedBackup.data.absences.length} Abwesenheiten
                </p>
              </div>

              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-red-300 font-medium">Achtung!</p>
                    <p className="text-red-400">
                      Alle aktuellen Daten werden durch das Backup ersetzt. Diese Aktion kann nicht rückgängig gemacht werden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1f2937', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={() => setRestoreDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleRestoreBackup} 
            disabled={isProcessing}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ef4444 30%, #dc2626 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {isProcessing ? 'Stelle wieder her...' : 'Wiederherstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}