import React from 'react';
import { Button } from '@mui/material';
import { Wand2, Minimize2 } from 'lucide-react';
import { MonacoCodeEditor } from './MonacoCodeEditor';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onBeautify: () => void;
  onMinify: () => void;
  onClear: () => void;
}

export function CodeInput({ 
  value, 
  onChange, 
  language, 
  onBeautify, 
  onMinify, 
  onClear 
}: CodeInputProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
    <div className="space-y-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">
            {getLanguageDisplayName(language)} Eingabe
          </h3>
          <div className="text-sm text-gray-400">
            {value ? formatBytes(new Blob([value]).size) : '0 Bytes'}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <MonacoCodeEditor
            value={value}
            onChange={onChange}
            language={language}
            height="100%"
          />
        </div>
        
        <div className="flex gap-2 p-4 border-t border-gray-700 flex-shrink-0">
          <Button 
            onClick={onBeautify} 
            variant="contained"
            size="large"
            startIcon={<Wand2 size={16} />}
            sx={{
              flex: 1,
              background: 'linear-gradient(45deg, #9333ea 30%, #3b82f6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #2563eb 90%)',
              }
            }}
          >
            Beautify
          </Button>
          <Button 
            onClick={onMinify} 
            variant="contained"
            size="large"
            startIcon={<Minimize2 size={16} />}
            sx={{
              flex: 1,
              background: 'linear-gradient(45deg, #dc2626 30%, #ea580c 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b91c1c 30%, #c2410c 90%)',
              }
            }}
          >
            Minify
          </Button>
          <Button 
            variant="outlined" 
            onClick={onClear}
            size="large"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Löschen
          </Button>
        </div>
      </div>
    </div>
  );
}