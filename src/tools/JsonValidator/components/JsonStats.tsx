import React from 'react';
import { BarChart3 } from 'lucide-react';

interface JsonStats {
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  totalKeys: number;
  maxDepth: number;
  size: number;
}

interface JsonStatsProps {
  stats: JsonStats;
  show: boolean;
}

export function JsonStatsComponent({ stats, show }: JsonStatsProps) {
  if (!show) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        JSON Statistiken
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.objects}</div>
          <div className="text-sm text-gray-400">Objekte</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.arrays}</div>
          <div className="text-sm text-gray-400">Arrays</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.totalKeys}</div>
          <div className="text-sm text-gray-400">Schlüssel</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">{stats.maxDepth}</div>
          <div className="text-sm text-gray-400">Max. Tiefe</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-400">{stats.strings}</div>
          <div className="text-sm text-gray-400">Strings</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.numbers}</div>
          <div className="text-sm text-gray-400">Zahlen</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-pink-400">{stats.booleans}</div>
          <div className="text-sm text-gray-400">Booleans</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{stats.nulls}</div>
          <div className="text-sm text-gray-400">Null-Werte</div>
        </div>
      </div>
    </div>
  );
}