import React, { useState, useMemo } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Code2, Wand2, Minimize2, FileCode, AlertTriangle } from 'lucide-react';
import { CodeInput } from './components/CodeInput';
import { CodeOutput } from './components/CodeOutput';
import { CodeStatsComponent } from './components/CodeStats';
import { beautifyCode, minifyCode, calculateCodeStats } from './utils/codeUtils';

const codeExamples = {
  'HTML': `<!DOCTYPE html>
<html><head><title>Example</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph.</p></div></body></html>`,
  'CSS': `.container{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f0f0f0;}.title{font-size:2rem;color:#333;margin-bottom:1rem;}`,
  'JavaScript': `function calculateSum(a,b){if(typeof a!=='number'||typeof b!=='number'){throw new Error('Invalid input');}return a+b;}const result=calculateSum(5,10);console.log('Result:',result);`,
  'TypeScript': `interface User{id:number;name:string;email:string;}function createUser(userData:Partial<User>):User{return{id:Math.random(),name:'',email:'',...userData};}const user=createUser({name:'John Doe',email:'john@example.com'});`
};

type Language = 'html' | 'css' | 'javascript' | 'typescript' | 'php';

interface ProcessingResult {
  success: boolean;
  code?: string;
  error?: string;
}

export function CodeBeautifierMinifier() {
  const [codeInput, setCodeInput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [processedResult, setProcessedResult] = useState<ProcessingResult | null>(null);
  const [isMinified, setIsMinified] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const codeStats = useMemo(() => {
    if (!processedResult?.success || !processedResult.code || typeof processedResult.code !== 'string') return null;
    
    const stats = calculateCodeStats(processedResult.code, language);
    return {
      ...stats,
      originalSize: new Blob([codeInput]).size,
      processedSize: new Blob([processedResult.code]).size
    };
  }, [processedResult, codeInput, language]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as Language);
    setProcessedResult(null);
  };

  const processCode = async (minify: boolean) => {
    if (!codeInput.trim()) {
      setProcessedResult({
        success: false,
        error: 'Bitte geben Sie Code ein'
      });
      return;
    }

    if (language === 'php') {
      setProcessedResult({
        success: false,
        error: 'PHP-Verarbeitung ist im Browser nicht verfügbar. Verwenden Sie serverseitige Tools wie PHP_CodeSniffer.'
      });
      return;
    }

    try {
      const result = minify ? await minifyCode(codeInput, language) : beautifyCode(codeInput, language);
      setProcessedResult({
        success: true,
        code: result
      });
      setIsMinified(minify);
    } catch (error) {
      setProcessedResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });
    }
  };

  const copyToClipboard = async () => {
    if (processedResult?.code) {
      await navigator.clipboard.writeText(processedResult.code);
    }
  };

  const downloadCode = () => {
    if (processedResult?.code) {
      const extensions = {
        html: 'html',
        css: 'css',
        javascript: 'js',
        typescript: 'ts',
        php: 'php'
      };
      
      const blob = new Blob([processedResult.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processed.${extensions[language]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadExample = (exampleKey: string) => {
    const example = codeExamples[exampleKey as keyof typeof codeExamples];
    const languageMap: { [key: string]: Language } = {
      'HTML': 'html',
      'CSS': 'css',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript'
    };
    
    setCodeInput(example);
    setLanguage(languageMap[exampleKey] || 'javascript');
    setProcessedResult(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeInput(content);
        setProcessedResult(null);
      };
      reader.readAsText(file);
    }
  };

  const clearInput = () => {
    setCodeInput('');
    setProcessedResult(null);
  };

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <Code2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Code Beautifier & Minifier</h1>
            <p className="text-gray-400">Formatiere und komprimiere deinen Code professionell</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Left side - Language selector and examples */}
          <div className="flex items-center gap-3">
            <FormControl size="medium" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: 'white' }}>Sprache</InputLabel>
              <Select
                value={language}
                onChange={handleLanguageChange}
                label="Sprache"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9333ea',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="css">CSS</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="typescript">TypeScript</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
              </Select>
            </FormControl>

            <div className="flex items-center gap-2">
              {Object.keys(codeExamples).map((example) => (
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
                  onClick={() => loadExample(example)}
                >
                  {example}
                </Button>
              ))}
            </div>

            <div className="flex items-center ml-2">
              <input
                type="file"
                accept=".html,.css,.js,.ts,.php"
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
          
          {/* Right side - Stats button */}
          <div className="flex items-center gap-2">
            {processedResult?.success && (
              <Button
                size="medium"
                variant="outlined"
                startIcon={<FileCode size={16} />}
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
            )}
          </div>
        </div>

        {/* PHP Warning */}
        {language === 'php' && (
          <Card className="p-4 border-orange-500/50 bg-orange-900/20">
            <div className="flex items-center gap-3 text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">PHP-Hinweis</p>
                <p className="text-sm text-orange-400 mt-1">
                  PHP-Code kann im Browser nicht verarbeitet werden. Verwenden Sie serverseitige Tools wie PHP_CodeSniffer oder Online-Services.
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Editors Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CodeInput
            value={codeInput}
            onChange={setCodeInput}
            language={language}
            onBeautify={() => processCode(false)}
            onMinify={() => processCode(true)}
            onClear={clearInput}
          />
          
          <CodeOutput
            result={processedResult}
            language={language}
            isMinified={isMinified}
            onCopy={copyToClipboard}
            onDownload={downloadCode}
          />
        </div>
      </div>

      {/* Statistics */}
      {codeStats && (
        <div className="mt-8">
          <CodeStatsComponent stats={codeStats} show={showStats} />
        </div>
      )}

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Multi-Language Support</h4>
            <p>Unterstützt HTML, CSS, JavaScript und TypeScript mit spezialisierten Parsern für jede Sprache.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Beautify & Minify</h4>
            <p>Formatiert Code für bessere Lesbarkeit oder komprimiert ihn für optimale Performance.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Statistiken & Analyse</h4>
            <p>Detaillierte Code-Analyse mit Zeilen-, Zeichen- und Größenvergleich vor/nach der Verarbeitung.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}