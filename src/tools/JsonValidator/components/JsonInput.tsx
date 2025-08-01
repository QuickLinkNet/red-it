import React from 'react';
import { Button } from '@mui/material';
import { MonacoJsonEditor } from './MonacoJsonEditor';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
  onClear: () => void;
}

export function JsonInput({ value, onChange, onValidate, onClear }: JsonInputProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Editor Container */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">JSON Eingabe</h3>
          <div className="text-sm text-gray-400">
            {value ? formatBytes(new Blob([value]).size) : '0 Bytes'}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <MonacoJsonEditor
            value={value}
            onChange={onChange}
            height="100%"
          />
        </div>
        
        <div className="flex gap-3 p-4 border-t border-gray-700 flex-shrink-0">
          <Button 
            onClick={onValidate} 
            variant="contained"
            size="large"
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #9333ea 30%, #3b82f6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed 30%, #2563eb 90%)',
              }
            }}
          >
            JSON validieren
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