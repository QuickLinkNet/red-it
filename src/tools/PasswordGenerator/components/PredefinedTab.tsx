import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Button, SelectChangeEvent } from '@mui/material';
import { Shield, Zap } from 'lucide-react';

interface PredefinedConfig {
  type: string;
  count: number;
  excludeSimilar: boolean;
  avoidRepeating: boolean;
}

interface PredefinedTabProps {
  onGenerate: (config: PredefinedConfig) => void;
  isGenerating: boolean;
}

const passwordTypes = [
  { value: 'internet1', label: 'Internet-Passwörter 1', description: '8 Zeichen' },
  { value: 'internet2', label: 'Internet-Passwörter 2', description: '10 Zeichen' },
  { value: 'internet3', label: 'Internet-Passwörter 3', description: '14 Zeichen' },
  { value: 'manager1', label: 'Passwort-Manager 1', description: '16 Zeichen' },
  { value: 'manager2', label: 'Passwort-Manager 2', description: '32 Zeichen' },
  { value: 'manager3', label: 'Passwort-Manager 3', description: '64 Zeichen' },
  { value: 'wep64', label: 'WEP-Schlüssel', description: '64 Bit' },
  { value: 'wep128', label: 'WEP-Schlüssel', description: '128 Bit' },
  { value: 'wep256', label: 'WEP-Schlüssel', description: '256 Bit' },
  { value: 'wpa2', label: 'WPA2-Schlüssel', description: '63 Zeichen' },
];

const countOptions = [1, 3, 8, 10, 25, 50, 100];

export function PredefinedTab({ onGenerate, isGenerating }: PredefinedTabProps) {
  const [config, setConfig] = useState<PredefinedConfig>({
    type: 'internet2',
    count: 10,
    excludeSimilar: true,
    avoidRepeating: true,
  });

  const handleTypeChange = (event: SelectChangeEvent) => {
    setConfig({ ...config, type: event.target.value });
  };

  const handleCountChange = (event: SelectChangeEvent) => {
    setConfig({ ...config, count: Number(event.target.value) });
  };

  const handleCheckboxChange = (field: keyof PredefinedConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [field]: event.target.checked });
  };

  const handleGenerate = () => {
    onGenerate(config);
  };

  const selectedType = passwordTypes.find(type => type.value === config.type);

  return (
    <div className="space-y-6">
      {/* Password Type Selection */}
      <div>
        <FormControl fullWidth>
          <InputLabel sx={{ color: 'white' }}>Passwort-Typ</InputLabel>
          <Select
            value={config.type}
            onChange={handleTypeChange}
            label="Passwort-Typ"
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
              '.MuiSvgIcon-root': { color: 'white' },
            }}
          >
            {passwordTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <div className="flex justify-between items-center w-full">
                  <span>{type.label}</span>
                  <span className="text-gray-400 text-sm ml-4">{type.description}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedType && (
          <div className="mt-2 p-3 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Shield className="h-4 w-4 text-red-400" />
              <span>{selectedType.label} - {selectedType.description}</span>
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={config.excludeSimilar}
                onChange={handleCheckboxChange('excludeSimilar')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-checked': { color: '#ef4444' },
                }}
              />
            }
            label={<span className="text-gray-300 text-sm">Leicht verwechselbare Zeichen ausschließen</span>}
          />
          
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

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: 'white' }}>Anzahl der Passwörter</InputLabel>
          <Select
            value={config.count.toString()}
            onChange={handleCountChange}
            label="Anzahl der Passwörter"
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' },
              '.MuiSvgIcon-root': { color: 'white' },
            }}
          >
            {countOptions.map((count) => (
              <MenuItem key={count} value={count.toString()}>
                {count}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="contained"
          size="large"
          startIcon={isGenerating ? <Zap className="animate-spin h-5 w-5" /> : <Shield className="h-5 w-5" />}
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