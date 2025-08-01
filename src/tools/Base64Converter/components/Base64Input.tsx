import React from 'react';
import { Button } from '@mui/material';
import { MonacoTextEditor } from './MonacoTextEditor';

interface Base64InputProps {
  value: string;
  onChange: (value: string) => void;
  onEncode: () => void;
  onDecode: () => void;
  onClear: () => void;
}

export function Base64Input({ 
  value, 
  onChange, 
  onEncode, 
  onDecode, 
  onClear 
}: Base64InputProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">Eingabe</h3>
          <div className="text-sm text-gray-400">
            {value ? formatBytes(new Blob([value]).size) : '0 Bytes'}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <MonacoTextEditor
            value={value}
            onChange={onChange}
            height="100%"
            placeholder="Text oder Base64-String hier eingeben..."
          />
        </div>
        
        <div className="flex gap-2 p-4 border-t border-gray-700 flex-shrink-0">
          <Button 
            onClick={onEncode} 
            variant="contained"
            size="large"
            sx={{
              flex: 1,
              background: 'linear-gradient(45deg, #059669 30%, #10b981 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #047857 30%, #059669 90%)',
              }
            }}
          >
            Kodieren
          </Button>
          <Button 
            onClick={onDecode} 
            variant="contained"
            size="large"
            sx={{
              flex: 1,
              background: 'linear-gradient(45deg, #dc2626 30%, #ea580c 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b91c1c 30%, #c2410c 90%)',
              }
            }}
          >
            Dekodieren
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