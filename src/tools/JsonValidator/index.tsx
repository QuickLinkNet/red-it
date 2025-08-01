import React, { useState, useMemo } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Button, IconButton } from '@mui/material';
import { FileCode, BarChart3, Maximize2, Minimize2 } from 'lucide-react';
import { JsonInput } from './components/JsonInput';
import { JsonOutput } from './components/JsonOutput';
import { JsonStatsComponent } from './components/JsonStats';
import { calculateJsonStats } from './utils/jsonUtils';

const jsonExamples = {
  'Benutzer': `{
  "id": 1,
  "name": "Max Mustermann",
  "email": "max@example.com",
  "active": true,
  "profile": {
    "age": 30,
    "city": "Berlin",
    "interests": ["coding", "music", "travel"]
  }
}`,
  'API Response': `{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      {
        "id": 2,
        "username": "jane_smith",
        "email": "jane@example.com"
      }
    ],
    "total": 2,
    "page": 1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`,
  'Konfiguration': `{
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
    "debug": false
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db"
  },
  "features": {
    "authentication": true,
    "logging": true,
    "caching": false
  }
}`
};

interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  parsed?: any;
}

export function JsonValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isMinified, setIsMinified] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const jsonStats = useMemo(() => {
    if (!validationResult?.isValid || !validationResult.parsed) return null;
    
    const stats = calculateJsonStats(validationResult.parsed);
    return {
      ...stats,
      size: new Blob([jsonInput]).size
    };
  }, [validationResult, jsonInput]);

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setValidationResult({
        isValid: false,
        error: 'Bitte geben Sie JSON-Daten ein'
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = isMinified ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setValidationResult({
        isValid: true,
        formatted,
        parsed
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });
    }
  };

  const toggleMinify = () => {
    setIsMinified(!isMinified);
    if (validationResult?.isValid && validationResult.parsed) {
      const formatted = !isMinified ? JSON.stringify(validationResult.parsed) : JSON.stringify(validationResult.parsed, null, 2);
      setValidationResult({
        ...validationResult,
        formatted
      });
    }
  };

  const copyToClipboard = async () => {
    if (validationResult?.formatted) {
      await navigator.clipboard.writeText(validationResult.formatted);
    }
  };

  const downloadJson = () => {
    if (validationResult?.formatted) {
      const blob = new Blob([validationResult.formatted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'validated.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadExample = (example: string) => {
    setJsonInput(example);
    setValidationResult(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
        setValidationResult(null);
      };
      reader.readAsText(file);
    }
  };

  const clearInput = () => {
    setJsonInput('');
    setValidationResult(null);
  };

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <FileCode className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">JSON Validator</h1>
            <p className="text-gray-400">Überprüfe, formatiere und analysiere deine JSON-Daten</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Buttons Row - Above both containers */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Left side buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {Object.keys(jsonExamples).map((example) => (
                <Button
                  key={example}
                  variant="outlined"
                  size="medium"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => loadExample(jsonExamples[example as keyof typeof jsonExamples])}
                >
                  {example}
                </Button>
              ))}
            </div>
            <div className="flex items-center ml-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  size="medium"
                  component="span"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Datei laden
                </Button>
              </label>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {validationResult?.isValid && (
              <>
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={<BarChart3 size={16} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => setShowStats(!showStats)}
                >
                  {showStats ? 'Stats ausblenden' : 'Stats anzeigen'}
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={isMinified ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={toggleMinify}
                >
                  {isMinified ? 'Formatieren' : 'Minify'}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Editors Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <JsonInput
          value={jsonInput}
          onChange={setJsonInput}
          onValidate={validateJson}
          onClear={clearInput}
        />
        
        <JsonOutput
          result={validationResult}
          isMinified={isMinified}
          onCopy={copyToClipboard}
          onDownload={downloadJson}
        />
        </div>
      </div>

      {/* Statistics */}
      {jsonStats && (
        <div className="mt-8">
          <JsonStatsComponent stats={jsonStats} show={showStats} />
        </div>
      )}

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Validierung & Formatierung</h4>
            <p>Überprüft JSON-Syntax, formatiert automatisch und bietet Minify-Option für kompakte Ausgabe.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Statistiken & Analyse</h4>
            <p>Detaillierte Analyse der JSON-Struktur mit Objektzählung, Verschachtelungstiefe und Dateigröße.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Import & Export</h4>
            <p>Laden Sie JSON-Dateien hoch, verwenden Sie Beispiele oder exportieren Sie das Ergebnis.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}