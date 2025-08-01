import React from 'react';
import { Card } from '../../../components/Card';
import { Calendar, Clock } from 'lucide-react';

interface CronPreviewProps {
  cronExpression: string;
  description?: string;
  nextExecutions: Date[];
}

export function CronPreview({ cronExpression, description, nextExecutions }: CronPreviewProps) {
  const parts = cronExpression.split(' ');
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const formatPart = (part: string, type: string) => {
    if (part === '*') return `Jede(r) ${type}`;
    if (part.includes('/')) {
      const [, interval] = part.split('/');
      return `Alle ${interval} ${type}(n)`;
    }
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      return `${start}-${end}`;
    }
    if (part.includes(',')) {
      return part.split(',').join(', ');
    }
    return part;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Cron Expression Übersicht
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expression Breakdown */}
        <div>
          <h4 className="text-white font-medium mb-4">Expression Aufschlüsselung</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">Minute:</span>
              <span className="text-white font-mono text-center">{minute}</span>
              <span className="text-gray-300 text-right">{formatPart(minute, 'Minute')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">Stunde:</span>
              <span className="text-white font-mono text-center">{hour}</span>
              <span className="text-gray-300 text-right">{formatPart(hour, 'Stunde')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">Tag:</span>
              <span className="text-white font-mono text-center">{dayOfMonth}</span>
              <span className="text-gray-300 text-right">{formatPart(dayOfMonth, 'Tag')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">Monat:</span>
              <span className="text-white font-mono text-center">{month}</span>
              <span className="text-gray-300 text-right">{formatPart(month, 'Monat')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-900 rounded-lg text-sm">
              <span className="text-gray-400 font-medium">Wochentag:</span>
              <span className="text-white font-mono text-center">{dayOfWeek}</span>
              <span className="text-gray-300 text-right">{formatPart(dayOfWeek, 'Wochentag')}</span>
            </div>
          </div>
        </div>

        {/* Schedule Preview */}
        <div>
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Zeitplan Vorschau
          </h4>
          
          {description && (
            <div className="mb-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-blue-300 font-medium">{description}</p>
            </div>
          )}

          <div className="space-y-1">
            <h5 className="text-gray-400 text-sm font-medium">Nächste 5 Ausführungen:</h5>
            {nextExecutions.map((date, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded text-sm">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white font-mono text-xs">
                    {date.toLocaleDateString('de-DE', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                    {' '}
                    {date.toLocaleTimeString('de-DE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="text-gray-500 text-xs flex-shrink-0">
                  {index === 0 ? 'Nächste' : 
                     Math.ceil((date.getTime() - nextExecutions[0].getTime()) / (1000 * 60 * 60 * 24)) > 0 
                       ? `+${Math.ceil((date.getTime() - nextExecutions[0].getTime()) / (1000 * 60 * 60 * 24))}d`
                       : 'Heute'
                    }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}