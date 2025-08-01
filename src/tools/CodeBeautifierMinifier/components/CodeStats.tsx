import React from 'react';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';

interface CodeStats {
  lines: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  originalSize: number;
  processedSize: number;
}

interface CodeStatsProps {
  stats: CodeStats;
  show: boolean;
}

export function CodeStatsComponent({ stats, show }: CodeStatsProps) {
  if (!show) return null;

  const compressionRatio = ((stats.originalSize - stats.processedSize) / stats.originalSize * 100);
  const isCompressed = compressionRatio > 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Code Statistiken
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.lines}</div>
          <div className="text-sm text-gray-400">Zeilen</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.characters.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Zeichen</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.charactersNoSpaces.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Zeichen (ohne Leerzeichen)</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">{stats.words.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Wörter</div>
        </div>
      </div>

      {/* Size comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-lg font-bold text-cyan-400">{formatBytes(stats.originalSize)}</div>
          <div className="text-sm text-gray-400">Original Größe</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-lg font-bold text-yellow-400">{formatBytes(stats.processedSize)}</div>
          <div className="text-sm text-gray-400">Verarbeitete Größe</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className={`text-lg font-bold flex items-center gap-2 ${
            isCompressed ? 'text-green-400' : 'text-red-400'
          }`}>
            {isCompressed ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {Math.abs(compressionRatio).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">
            {isCompressed ? 'Komprimierung' : 'Vergrößerung'}
          </div>
        </div>
      </div>
    </div>
  );
}