import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  description?: string;
}

interface CronOutputProps {
  cronExpression: string;
  validation: ValidationResult;
  nextExecutions: Date[];
}

export function CronOutput({ 
  cronExpression, 
  validation, 
  nextExecutions 
}: CronOutputProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg flex flex-col min-h-[20rem]">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0 h-16">
        <h3 className="text-lg font-semibold text-white">Cron Expression</h3>
        {validation.isValid && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Gültig</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-6">
        {!cronExpression ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Erstellen Sie einen Cron-Ausdruck</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Expression Display */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Expression</h4>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-lg text-white border">
                {cronExpression}
              </div>
            </div>

            {/* Validation Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                validation.isValid 
                  ? 'bg-green-900/20 border border-green-800 text-green-300'
                  : 'bg-red-900/20 border border-red-800 text-red-300'
              }`}>
                {validation.isValid ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {validation.isValid ? 'Gültiger Cron-Ausdruck' : 'Ungültiger Cron-Ausdruck'}
                </span>
              </div>
              {validation.error && (
                <p className="text-sm text-red-400 mt-2">{validation.error}</p>
              )}
            </div>

            {/* Description */}
            {validation.isValid && validation.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Beschreibung</h4>
                <div className="bg-gray-900 rounded-lg p-4 text-white">
                  {validation.description}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}