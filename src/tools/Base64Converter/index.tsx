import React, { useState } from 'react';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Button } from '@mui/material';
import { Binary, FileText, Code, Info } from 'lucide-react';
import { Base64Input } from './components/Base64Input';
import { Base64Output } from './components/Base64Output';
import { encodeBase64, decodeBase64, detectInputType } from './utils/base64Utils';

interface ConversionResult {
  success: boolean;
  result?: string;
  error?: string;
  operation: 'encode' | 'decode';
}

const examples = {
  'Einfacher Text': 'Hallo Welt! Dies ist ein Test.',
  'JSON': '{"name": "Max Mustermann", "email": "max@example.com", "active": true}',
  'HTML': '<div class="container"><h1>Willkommen</h1><p>Dies ist ein Beispiel.</p></div>',
  'Base64': 'SGFsbG8gV2VsdCEgRGllcyBpc3QgZWluIFRlc3Qu'
};

export function Base64Converter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const handleEncode = () => {
    const conversionResult = encodeBase64(input);
    setResult(conversionResult);
  };

  const handleDecode = () => {
    const conversionResult = decodeBase64(input);
    setResult(conversionResult);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const copyToClipboard = async () => {
    if (result?.result) {
      await navigator.clipboard.writeText(result.result);
    }
  };

  const downloadResult = () => {
    if (result?.result) {
      const blob = new Blob([result.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `base64_${result.operation}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadExample = (example: string) => {
    setInput(example);
    setResult(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        setResult(null);
      };
      reader.readAsText(file);
    }
  };

  const inputType = detectInputType(input);

  return (
    <Container className="py-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-900/90">
              <Binary className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Base64 Converter</h1>
            <p className="text-gray-400">Kodiere und dekodiere Base64-Strings sicher im Browser</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Left side - Examples */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {Object.keys(examples).map((example) => (
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
                  onClick={() => loadExample(examples[example as keyof typeof examples])}
                >
                  {example}
                </Button>
              ))}
            </div>
            <div className="flex items-center ml-2">
              <input
                type="file"
                accept=".txt,.json,.html,.css,.js,.xml"
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
          
          {/* Right side - Input type detection */}
          {input && (
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                inputType === 'base64' 
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-800' 
                  : inputType === 'text'
                  ? 'bg-green-900/30 text-green-300 border border-green-800'
                  : 'bg-gray-900/30 text-gray-300 border border-gray-800'
              }`}>
                {inputType === 'base64' ? (
                  <>
                    <Code className="inline h-3 w-3 mr-1" />
                    Base64 erkannt
                  </>
                ) : inputType === 'text' ? (
                  <>
                    <FileText className="inline h-3 w-3 mr-1" />
                    Text erkannt
                  </>
                ) : (
                  'Unbekannt'
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Editors Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Base64Input
            value={input}
            onChange={setInput}
            onEncode={handleEncode}
            onDecode={handleDecode}
            onClear={handleClear}
          />
          
          <Base64Output
            result={result}
            onCopy={copyToClipboard}
            onDownload={downloadResult}
          />
        </div>
      </div>

      {/* Info Section */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Info className="h-5 w-5" />
          Was ist Base64?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-medium mb-2">Kodierung</h4>
            <p>Base64 ist ein Kodierungsverfahren, das Binärdaten in ASCII-Text umwandelt. Es verwendet 64 Zeichen (A-Z, a-z, 0-9, +, /) plus Padding (=).</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Anwendungsfälle</h4>
            <p>Häufig verwendet für Data URIs in CSS/HTML, E-Mail-Anhänge, API-Authentifizierung und die Übertragung von Binärdaten über textbasierte Protokolle.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Sicherheit</h4>
            <p>Base64 ist keine Verschlüsselung! Es ist nur eine Kodierung. Alle Daten werden lokal im Browser verarbeitet und nicht übertragen.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}