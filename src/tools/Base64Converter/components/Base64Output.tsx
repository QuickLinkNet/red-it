import React from 'react';
import { Button } from '@mui/material';
import { CheckCircle, XCircle, Binary, Copy, Download } from 'lucide-react';
import { MonacoTextEditor } from './MonacoTextEditor';

interface ConversionResult {
  success: boolean;
  result?: string;
  error?: string;
  operation?: 'encode' | 'decode';
}

interface Base64OutputProps {
  result: ConversionResult | null;
  onCopy: () => void;
  onDownload: () => void;
}

export function Base64Output({ 
  result, 
  onCopy, 
  onDownload 
}: Base64OutputProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0 h-16">
        <h3 className="text-lg font-semibold text-white">Ausgabe</h3>
        {result?.success && result.result && (
          <div className="text-sm text-gray-400">
            {formatBytes(new Blob([result.result]).size)}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {!result ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <div className="text-center">
              <Binary className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Klicken Sie auf "Kodieren" oder "Dekodieren" um zu beginnen</p>
            </div>
          </div>
        ) : result.success ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-green-400 p-4 pb-2 flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Erfolgreich {result.operation === 'encode' ? 'kodiert' : 'dekodiert'}
              </span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <MonacoTextEditor
                value={result.result || ''}
                onChange={() => {}} // Read-only
                readOnly={true}
                height="100%"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Konvertierungsfehler</span>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-300 text-sm font-mono">{result.error}</p>
            </div>
          </div>
        )}
      </div>

      {result?.success && result.result && (
        <div className="flex gap-2 p-4 border-t border-gray-700 flex-shrink-0">
          <Button 
            size="medium" 
            onClick={onCopy} 
            variant="contained"
            startIcon={<Copy size={16} />}
            sx={{
              background: 'linear-gradient(45deg, #059669 30%, #10b981 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #047857 30%, #059669 90%)',
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