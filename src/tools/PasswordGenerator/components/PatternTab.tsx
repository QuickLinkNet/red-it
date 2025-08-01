import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { Key, Zap, Info } from 'lucide-react';

interface PatternConfig {
  pattern: string;
  specialChars: string;
  excludeChars: string;
  count: number;
  avoidRepeating: boolean;
}

interface PatternTabProps {
  onGenerate: (config: PatternConfig) => void;
  isGenerating: boolean;
}

const patternExamples = [
  { pattern: 'aAnN*8', description: 'Acht Zeichen aus Groß-/Kleinbuchstaben und Zahlen' },
  { pattern: 'A|a*6|nN', description: 'Großbuchstabe + 6 Kleinbuchstaben + Zahl' },
  { pattern: 'L|r|l|r|s|nN*2|n', description: 'Komplexes Muster mit Tastatur-Layout' },
];

export function PatternTab({ onGenerate, isGenerating }: PatternTabProps) {
  const [config, setConfig] = useState<PatternConfig>({
    pattern: 'A|a*6|nN',
    specialChars: '.:,;-_!?=()/+@',
    excludeChars: '1lIoO0',
    count: 10,
    avoidRepeating: true,
  });

  const handleTextChange = (field: keyof PatternConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [field]: event.target.value });
  };

  const handleNumberChange = (field: keyof PatternConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(100, Number(event.target.value)));
    setConfig({ ...config, [field]: value });
  };

  const handleCheckboxChange = (field: keyof PatternConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [field]: event.target.checked });
  };

  const handleGenerate = () => {
    if (!config.pattern.trim()) {
      alert('Bitte geben Sie ein Passwort-Muster ein.');
      return;
    }

    if (config.pattern.length > 250) {
      alert('Das Passwort-Muster darf maximal 250 Zeichen lang sein.');
      return;
    }

    onGenerate(config);
  };

  const loadExample = (pattern: string) => {
    setConfig({ ...config, pattern });
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <TextField
          label="Passwort-Muster (max. 250 Zeichen)"
          value={config.pattern}
          onChange={handleTextChange('pattern')}
          fullWidth
          multiline
          rows={3}
          placeholder="z.B. A|a*6|nN"
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
        <div className="mt-2 text-xs text-gray-400">
          {config.pattern.length}/250 Zeichen
        </div>
      </div>

      {/* Pattern Examples */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Beispiele
        </h4>
        <div className="space-y-2">
          {patternExamples.map((example, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-900 rounded">
              <div>
                <code className="text-red-400 text-sm">{example.pattern}</code>
                <p className="text-gray-400 text-xs mt-1">{example.description}</p>
              </div>
              <Button
                size="small"
                onClick={() => loadExample(example.pattern)}
                sx={{
                  color: '#ef4444',
                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                  textTransform: 'none',
                  fontSize: '0.75rem',
                }}
              >
                Verwenden
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Reference */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Platzhalter-Referenz</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <code className="text-red-400">a</code>
              <span className="text-gray-400">Kleinbuchstaben</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">A</code>
              <span className="text-gray-400">Großbuchstaben</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">n</code>
              <span className="text-gray-400">Zahlen (1-9)</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">N</code>
              <span className="text-gray-400">Zahl Null (0)</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">v</code>
              <span className="text-gray-400">Vokale klein</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">V</code>
              <span className="text-gray-400">Vokale groß</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">k</code>
              <span className="text-gray-400">Konsonanten klein</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <code className="text-red-400">K</code>
              <span className="text-gray-400">Konsonanten groß</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">l</code>
              <span className="text-gray-400">Konsonanten links</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">L</code>
              <span className="text-gray-400">Konsonanten links groß</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">r</code>
              <span className="text-gray-400">Konsonanten rechts</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">R</code>
              <span className="text-gray-400">Konsonanten rechts groß</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">h</code>
              <span className="text-gray-400">Hexadezimal klein</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">H</code>
              <span className="text-gray-400">Hexadezimal groß</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">s</code>
              <span className="text-gray-400">Einfache Sonderzeichen</span>
            </div>
            <div className="flex justify-between">
              <code className="text-red-400">S</code>
              <span className="text-gray-400">Benutzerdefinierte Sonderzeichen</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
          <p><strong>Multiplikatoren:</strong> <code className="text-red-400">a*6</code> = 6 Kleinbuchstaben</p>
          <p><strong>Trennung:</strong> <code className="text-red-400">A|a|n</code> = Großbuchstabe + Kleinbuchstabe + Zahl</p>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Sonderzeichen (für S)"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          startIcon={isGenerating ? <Zap className="animate-spin h-5 w-5" /> : <Key className="h-5 w-5" />}
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