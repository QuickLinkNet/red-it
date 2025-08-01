import React, { useState } from 'react';
import { FormControlLabel, Checkbox, TextField, Button } from '@mui/material';
import { Settings, Zap } from 'lucide-react';

interface CharacterSets {
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  zero: boolean;
  special: boolean;
}

interface CustomConfig {
  firstChar: CharacterSets;
  middleChars: CharacterSets;
  lastChar: CharacterSets;
  specialChars: string;
  excludeChars: string;
  length: number;
  count: number;
  avoidRepeating: boolean;
}

interface CharacterSets {
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  zero: boolean;
}
const countOptions = [1, 3, 8, 10, 25, 50, 100];

export function CustomTab({ onGenerate, isGenerating }: CustomTabProps) {
  const [config, setConfig] = useState<CustomConfig>({
    firstChar: { uppercase: true, lowercase: true, digits: false, zero: false, special: false },
    middleChars: { uppercase: true, lowercase: true, digits: true, zero: true, special: true },
    lastChar: { uppercase: true, lowercase: true, digits: true, zero: false, special: false },
    specialChars: '.:,;-_!?=()/+@',
    excludeChars: '1lIoO0',
    length: 12,
    count: 10,
    avoidRepeating: true,
  });

  const handleCharSetChange = (section: 'firstChar' | 'middleChars' | 'lastChar') => 
    (char: keyof CharacterSets) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
    }
    (checked: boolean) => {
      setConfig({
        ...config,
        [section]: {
          ...config[section],
          [char]: event.target.checked,
        },
      });
    };

  const handleTextChange = (field: keyof CustomConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [field]: event.target.value });
  };

  const handleNumberChange = (field: keyof CustomConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(1024, Number(event.target.value)));
    setConfig({ ...config, [field]: value });
  };

  const handleCheckboxChange = (field: keyof CustomConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [field]: event.target.checked });
  };

  const handleGenerate = () => {
    // Validate that at least one character set is selected for each position
    const hasFirstChar = Object.values(config.firstChar).some(Boolean);
    const hasMiddleChars = Object.values(config.middleChars).some(Boolean);
    const hasLastChar = Object.values(config.lastChar).some(Boolean);

    if (!hasFirstChar || !hasMiddleChars || !hasLastChar) {
      alert('Bitte wählen Sie mindestens eine Zeichenklasse für jede Position aus.');
      return;
    }

    onGenerate(config);
  };

  const CharacterSetSection = ({ 
    title, 
    charSet, 
    section
  }: { 
    title: string; 
    charSet: CharacterSets; 
    section: 'firstChar' | 'middleChars' | 'lastChar';
  }) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h4 className="text-white font-medium mb-3 text-sm">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        <FormControlLabel
          control={<Checkbox checked={charSet.uppercase} onChange={handleCharSetChange(section)('uppercase')} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-checked': { color: '#ef4444' } }} />}
          label={<span className="text-gray-300 text-xs">Großbuchstaben (A-Z)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={charSet.lowercase} onChange={handleCharSetChange(section)('lowercase')} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-checked': { color: '#ef4444' } }} />}
          label={<span className="text-gray-300 text-xs">Kleinbuchstaben (a-z)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={charSet.digits} onChange={handleCharSetChange(section)('digits')} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-checked': { color: '#ef4444' } }} />}
          label={<span className="text-gray-300 text-xs">Ziffern (1-9)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={charSet.zero} onChange={handleCharSetChange(section)('zero')} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-checked': { color: '#ef4444' } }} />}
          label={<span className="text-gray-300 text-xs">Zahl Null (0)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={charSet.special} onChange={handleCharSetChange(section)('special')} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-checked': { color: '#ef4444' } }} />}
          label={<span className="text-gray-300 text-xs">Sonderzeichen</span>}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Character Sets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CharacterSetSection
          title="Erstes Zeichen"
          charSet={config.firstChar}
          section="firstChar"
        />
        <CharacterSetSection
          title="Weitere Zeichen"
          charSet={config.middleChars}
          section="middleChars"
        />
        <CharacterSetSection
          title="Letztes Zeichen"
          charSet={config.lastChar}
          section="lastChar"
        />
      </div>

      {/* Special Characters and Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Sonderzeichen"
          value={config.specialChars}
          onChange={handleTextChange('specialChars')}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#ef4444' },
            },
          }}
        />
        <TextField
          label="Zeichen ausschließen"
          value={config.excludeChars}
          onChange={handleTextChange('excludeChars')}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#ef4444' },
            },
          }}
        />
      </div>

      {/* Length and Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField
          label="Passwortlänge"
          type="number"
          value={config.length}
          onChange={handleNumberChange('length')}
          inputProps={{ min: 1, max: 1024 }}
          sx={{
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#ef4444' },
            },
          }}
        />
        <TextField
          label="Anzahl der Passwörter"
          type="number"
          value={config.count}
          onChange={handleNumberChange('count')}
          inputProps={{ min: 1, max: 100 }}
          sx={{
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#ef4444' },
            },
          }}
        />
        <div className="flex items-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={config.avoidRepeating}
                onChange={handleCheckboxChange('avoidRepeating')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-checked': { color: '#ef4444' },
                }}
              />
            }
            label={<span className="text-gray-300 text-sm">Aufeinanderfolgende gleiche Zeichen vermeiden</span>}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="contained"
          size="large"
          startIcon={isGenerating ? <Zap className="animate-spin h-5 w-5" /> : <Settings className="h-5 w-5" />}
          sx={{
            background: 'linear-gradient(45deg, #ef4444 30%, #f97316 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #dc2626 30%, #ea580c 90%)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
            px: 4,
            py: 1.5,
          }}
        >
          {isGenerating ? 'Generiere...' : 'Passwörter erstellen'}
        </Button>
      </div>
    </div>
  );
}