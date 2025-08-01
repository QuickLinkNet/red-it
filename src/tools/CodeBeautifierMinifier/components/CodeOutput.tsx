import React from 'react';
import { Button } from '@mui/material';
import { CheckCircle, XCircle, FileCode, Copy, Download, AlertTriangle } from 'lucide-react';
import { MonacoCodeEditor } from './MonacoCodeEditor';

interface ProcessingResult {
  success: boolean;
  code?: string;
  error?: string;
}

interface CodeOutputProps {
  result: ProcessingResult | null;
  language: string;
  isMinified: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function CodeOutput({ 
  result, 
  language,
  isMinified, 
  onCopy, 
  onDownload 
}: CodeOutputProps) {
  const getLanguageDisplayName = (lang: string) => {
    const names = {
      html: 'HTML',
      css: 'CSS',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      php: 'PHP'
    };
    return names[lang as keyof typeof names] || lang.toUpperCase();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0 h-16">
        <h3 className="text-lg font-semibold text-white">
          {getLanguageDisplayName(language)} Ausgabe
        </h3>
        {result?.success && (
          <div className="text-sm text-gray-400">
            {isMinified ? 'Minifiziert' : 'Formatiert'}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {!result ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <div className="text-center">
              <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Klicken Sie auf "Beautify" oder "Minify" um zu beginnen</p>
            </div>
          </div>
        ) : result.success ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-green-400 p-4 pb-2 flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Code erfolgreich {isMinified ? 'minifiziert' : 'formatiert'}
              </span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <MonacoCodeEditor
                value={result.code || ''}
                onChange={() => {}} // Read-only
                language={language}
                readOnly={true}
                height="100%"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              {language === 'php' ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">
                {language === 'php' ? 'Nicht unterstützt' : 'Verarbeitungsfehler'}
              </span>
            </div>
            <div className={`border rounded-lg p-4 ${
              language === 'php' 
                ? 'bg-orange-900/20 border-orange-800 text-orange-300' 
                : 'bg-red-900/20 border-red-800 text-red-300'
            }`}>
              <p className="text-sm font-mono">{result.error}</p>
            </div>
          </div>
        )}
      </div>

      {result?.success && (
        <div className="flex gap-2 p-4 border-t border-gray-700 flex-shrink-0">
          <Button 
            size="medium" 
            onClick={onCopy} 
            variant="contained"
            startIcon={<Copy size={16} />}
            sx={{
              background: 'linear-gradient(45deg, #9333ea 30%, #3b82f6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #2563eb 90%)',
              }
            }}
          >
            Kopieren
          </Button>
          <Button 
            size="medium" 
            variant="outlined" 
            onClick={onDownload} 
            startIcon={<Download size={16} />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
}