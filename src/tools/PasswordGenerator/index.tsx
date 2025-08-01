import React, { useState } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Tabs, Tab, Box } from '@mui/material';
import { Key, Shield, Settings } from 'lucide-react';
import { PredefinedTab } from './components/PredefinedTab';
import { CustomTab } from './components/CustomTab';
import { PatternTab } from './components/PatternTab';
import { PasswordOutput } from './components/PasswordOutput';
import { generatePredefinedPasswords, generateCustomPasswords, generatePatternPasswords } from './utils/passwordUtils';

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

export function PasswordGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPasswords([]);
  };

  const handlePredefinedGenerate = async (config: any) => {
    setIsGenerating(true);
    try {
      const generated = generatePredefinedPasswords(config);
      setPasswords(generated);
    } catch (error) {
      console.error('Fehler bei der Passwort-Generierung:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = async (config: any) => {
    setIsGenerating(true);
    try {
      const generated = generateCustomPasswords(config);
      setPasswords(generated);
    } catch (error) {
      console.error('Fehler bei der Passwort-Generierung:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePatternGenerate = async (config: any) => {
    setIsGenerating(true);
    try {
      const generated = generatePatternPasswords(config);
      setPasswords(generated);
    } catch (error) {
      console.error('Fehler bei der Passwort-Generierung:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <Key className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Passwort-Generator</h1>
            <p className="text-gray-400">Sichere Passwörter für alle Anwendungsfälle generieren</p>
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
                backgroundColor: '#ef4444',
              },
            }}
          >
            <Tab
              icon={<Shield className="h-4 w-4" />}
              label="Vordefiniert"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#ef4444' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<Settings className="h-4 w-4" />}
              label="Individuelle Zeichen"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#ef4444' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
            <Tab
              icon={<Key className="h-4 w-4" />}
              label="Passwort-Muster"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#ef4444' },
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
            />
          </Tabs>

          <div className="p-6">
            <TabPanel value={activeTab} index={0}>
              <PredefinedTab onGenerate={handlePredefinedGenerate} isGenerating={isGenerating} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <CustomTab onGenerate={handleCustomGenerate} isGenerating={isGenerating} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <PatternTab onGenerate={handlePatternGenerate} isGenerating={isGenerating} />
            </TabPanel>
          </div>
        </Card>

        {/* Password Output */}
        {passwords.length > 0 && (
          <PasswordOutput passwords={passwords} />
        )}
      </div>

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sicherheitshinweise</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Kryptographisch sicher</h4>
            <p>Alle Passwörter werden mit kryptographisch sicheren Zufallsfunktionen generiert.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Keine Speicherung</h4>
            <p>Generierte Passwörter werden nicht gespeichert oder übertragen - alles läuft lokal im Browser.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Flexible Optionen</h4>
            <p>Von einfachen Internet-Passwörtern bis zu komplexen Mustern für Passwort-Manager.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}