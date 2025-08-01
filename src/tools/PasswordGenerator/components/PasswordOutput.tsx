import React, { useState } from 'react';
import { Card } from '../../../components/Card';
import { Button, Snackbar, Alert } from '@mui/material';
import { Copy, Download, Eye, EyeOff, Shield } from 'lucide-react';

interface PasswordOutputProps {
  passwords: string[];
}

export function PasswordOutput({ passwords }: PasswordOutputProps) {
  const [showPasswords, setShowPasswords] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyAllPasswords = async () => {
    const text = passwords.join('\n');
    await navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  const copyPassword = async (password: string) => {
    await navigator.clipboard.writeText(password);
    setCopySuccess(true);
  };

  const downloadPasswords = () => {
    const content = `# Generierte Passwörter
# Erstellt am: ${new Date().toLocaleString()}
# Anzahl: ${passwords.length}

${passwords.join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 'Schwach', color: 'text-red-400', bg: 'bg-red-900/20' };
    if (score <= 4) return { level: 'Mittel', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    return { level: 'Stark', color: 'text-green-400', bg: 'bg-green-900/20' };
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            Generierte Passwörter ({passwords.length})
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={() => setShowPasswords(!showPasswords)}
              startIcon={showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                textTransform: 'none',
              }}
            >
              {showPasswords ? 'Ausblenden' : 'Anzeigen'}
            </Button>
            <Button
              size="small"
              onClick={copyAllPasswords}
              startIcon={<Copy className="h-4 w-4" />}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                textTransform: 'none',
              }}
            >
              Alle kopieren
            </Button>
            <Button
              size="small"
              onClick={downloadPasswords}
              startIcon={<Download className="h-4 w-4" />}
              sx={{
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                textTransform: 'none',
              }}
            >
              Download
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {passwords.map((password, index) => {
            const strength = getPasswordStrength(password);
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex-1 font-mono text-sm">
                  {showPasswords ? (
                    <span className="text-white">{password}</span>
                  ) : (
                    <span className="text-gray-500">{'•'.repeat(password.length)}</span>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs ${strength.bg} ${strength.color}`}>
                  {strength.level}
                </div>
                <div className="text-xs text-gray-400 min-w-[3rem]">
                  {password.length} Zeichen
                </div>
                <Button
                  size="small"
                  onClick={() => copyPassword(password)}
                  sx={{
                    minWidth: 'auto',
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { 
                      color: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)' 
                    },
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {passwords.length > 0 && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-blue-300 text-sm">
              <strong>Sicherheitshinweis:</strong> Verwenden Sie jedes Passwort nur einmal und speichern Sie es sicher in einem Passwort-Manager.
            </p>
          </div>
        )}
      </Card>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ backgroundColor: '#10b981', color: 'white' }}>
          In die Zwischenablage kopiert!
        </Alert>
      </Snackbar>
    </>
  );
}