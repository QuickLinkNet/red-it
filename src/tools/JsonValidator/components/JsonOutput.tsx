import React from 'react';
import { Button } from '@mui/material';
import { CheckCircle, XCircle, FileCode, Copy, Download, Minimize2, Maximize2, BarChart3 } from 'lucide-react';
import { MonacoJsonEditor } from './MonacoJsonEditor';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  parsed?: any;
}

interface JsonOutputProps {
  result: ValidationResult | null;
  isMinified: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function JsonOutput({ 
  result, 
  isMinified, 
  onCopy, 
  onDownload 
}: JsonOutputProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg h-[32rem] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0 h-16">
        <h3 className="text-lg font-semibold text-white">Validierungsergebnis</h3>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {!result ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <div className="text-center">
              <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Klicken Sie auf "JSON validieren" um zu beginnen</p>
            </div>
          </div>
        ) : result.isValid ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-green-400 p-4 pb-2 flex-shrink-0">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Gültiger JSON</span>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <MonacoJsonEditor
                value={result.formatted || ''}
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
              <span className="font-medium">Ungültiger JSON</span>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-300 text-sm font-mono">{result.error}</p>
            </div>
          </div>
        )}
      </div>

      {result?.isValid && (
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