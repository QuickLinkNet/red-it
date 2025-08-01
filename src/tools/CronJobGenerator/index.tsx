import React, { useState, useMemo } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';
import { Clock, Copy, Download, Calendar, AlertCircle } from 'lucide-react';
import { CronInput } from './components/CronInput';
import { CronOutput } from './components/CronOutput';
import { CronPreview } from './components/CronPreview';
import { generateCronExpression, parseCronExpression, getNextExecutions, validateCronExpression } from './utils/cronUtils';

const cronPresets = {
  'Jede Minute': '* * * * *',
  'Jede Stunde': '0 * * * *',
  'Täglich um Mitternacht': '0 0 * * *',
  'Täglich um 9:00': '0 9 * * *',
  'Wöchentlich (Sonntag)': '0 0 * * 0',
  'Monatlich (1. Tag)': '0 0 1 * *',
  'Werktags um 9:00': '0 9 * * 1-5',
  'Alle 15 Minuten': '*/15 * * * *',
  'Alle 6 Stunden': '0 */6 * * *'
};

interface CronFieldConfig {
  type: 'every' | 'even' | 'odd' | 'step' | 'specific';
  value?: number | number[];
}

interface CronConfig {
  minute: CronFieldConfig;
  hour: CronFieldConfig;
  dayOfMonth: CronFieldConfig;
  month: CronFieldConfig;
  dayOfWeek: CronFieldConfig;
}

export function CronJobGenerator() {
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [cronConfig, setCronConfig] = useState<CronConfig>({
    minute: { type: 'specific', value: [0] },
    hour: { type: 'specific', value: [9] },
    dayOfMonth: { type: 'every' },
    month: { type: 'every' },
    dayOfWeek: { type: 'weekdays', value: [1, 2, 3, 4, 5] }
  });
  const [mode, setMode] = useState<'visual' | 'manual'>('visual');

  const validation = useMemo(() => {
    return validateCronExpression(cronExpression);
  }, [cronExpression]);

  const nextExecutions = useMemo(() => {
    if (validation.isValid) {
      return getNextExecutions(cronExpression, 5);
    }
    return [];
  }, [cronExpression, validation.isValid]);

  const handleConfigChange = (newConfig: CronConfig) => {
    setCronConfig(newConfig);
    const newExpression = generateCronExpression(newConfig);
    setCronExpression(newExpression);
  };

  const handleExpressionChange = (expression: string) => {
    setCronExpression(expression);
    const parsed = parseCronExpression(expression);
    if (parsed) {
      setCronConfig(parsed);
    }
  };

  const loadPreset = (preset: string) => {
    const expression = cronPresets[preset as keyof typeof cronPresets];
    handleExpressionChange(expression);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cronExpression);
  };

  const downloadCron = () => {
    const content = `# Cron Job Expression
# Generated on ${new Date().toLocaleString()}
# Description: ${validation.description || 'Custom cron expression'}

${cronExpression}

# Next 5 executions:
${nextExecutions.map(date => `# ${date.toLocaleString()}`).join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cronjob.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Cron Job Generator</h1>
            <p className="text-gray-400">Erstelle und teste Cron-Ausdrücke für die Zeitplanung von Aufgaben</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Left side - Mode selector */}
          <div className="flex items-center gap-3">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'white' }}>Modus</InputLabel>
              <Select
                value={mode}
                onChange={(e: SelectChangeEvent) => setMode(e.target.value as 'visual' | 'manual')}
                label="Modus"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#10b981',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="visual">Visuell</MenuItem>
                <MenuItem value="manual">Manuell</MenuItem>
              </Select>
            </FormControl>
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {validation.isValid && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Copy size={16} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={copyToClipboard}
                >
                  Kopieren
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={downloadCron}
                >
                  Download
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {!validation.isValid && (
          <Card className="p-4 border-red-500/50 bg-red-900/20">
            <div className="flex items-center gap-3 text-red-300">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Ungültiger Cron-Ausdruck</p>
                <p className="text-sm text-red-400 mt-1">{validation.error}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Main Editor */}
        <div className="space-y-8">
          <CronInput
            mode={mode}
            cronExpression={cronExpression}
            cronConfig={cronConfig}
            onExpressionChange={handleExpressionChange}
            onConfigChange={handleConfigChange}
          />
          
          <CronOutput
            cronExpression={cronExpression}
            validation={validation}
            nextExecutions={nextExecutions}
          />
        </div>

        {/* Preview */}
        {validation.isValid && (
          <CronPreview
            cronExpression={cronExpression}
            description={validation.description}
            nextExecutions={nextExecutions}
          />
        )}
      </div>

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cron-Format Erklärung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Format: Minute Stunde Tag Monat Wochentag</h4>
            <div className="space-y-1 font-mono text-xs">
              <p><span className="text-green-400">*</span> - Jeder Wert</p>
              <p><span className="text-blue-400">5</span> - Spezifischer Wert (5)</p>
              <p><span className="text-purple-400">1-5</span> - Bereich (1 bis 5)</p>
              <p><span className="text-yellow-400">*/15</span> - Alle 15 Einheiten</p>
              <p><span className="text-cyan-400">1,3,5</span> - Liste von Werten</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Beispiele</h4>
            <div className="space-y-1 font-mono text-xs">
              <p><code className="text-green-400">0 9 * * 1-5</code> - Werktags um 9:00</p>
              <p><code className="text-blue-400">*/15 * * * *</code> - Alle 15 Minuten</p>
              <p><code className="text-purple-400">0 0 1 * *</code> - Monatlich am 1.</p>
              <p><code className="text-yellow-400">0 */6 * * *</code> - Alle 6 Stunden</p>
              <p><code className="text-cyan-400">30 2 * * 0</code> - Sonntags um 2:30</p>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}