import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { FileCode, Wand2, Clock, Key, Binary, Users } from 'lucide-react';

const apps = [
  { 
    name: 'JSON Validator', 
    description: 'Überprüfe und formatiere deine JSON-Daten',
    icon: FileCode,
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'group-hover:shadow-blue-500/20',
    path: '/tools/json-validator'
  },
  { 
    name: 'Code Beautifier', 
    description: 'Formatiere und komprimiere deinen Code',
    icon: Wand2,
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'group-hover:shadow-purple-500/20',
    path: '/tools/code-beautifier-minifier'
  },
  { 
    name: 'Cron Job Generator', 
    description: 'Erstelle und teste Cron-Ausdrücke für Zeitplanung',
    icon: Clock,
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'group-hover:shadow-green-500/20',
    path: '/tools/cron-job-generator'
  },
  { 
    name: 'Passwort-Generator', 
    description: 'Sichere Passwörter für alle Anwendungsfälle generieren',
    icon: Key,
    gradient: 'from-red-500 to-orange-500',
    shadow: 'group-hover:shadow-red-500/20',
    path: '/tools/password-generator'
  },
  { 
    name: 'Base64 Converter', 
    description: 'Kodiere und dekodiere Base64-Strings sicher im Browser',
    icon: Binary,
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'group-hover:shadow-emerald-500/20',
    path: '/tools/base64-converter'
  },
  { 
    name: 'Kapazitätsplanung', 
    description: 'Scrum Team Kapazitätsplanung mit Sprint-Management',
    icon: Users,
    gradient: 'from-blue-500 to-purple-500',
    shadow: 'group-hover:shadow-blue-500/20',
    path: '/tools/capacity-planning'
  },
].sort((a, b) => a.name.localeCompare(b.name));

export function HexagonGrid() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.name}
                to={app.path}
                className="block"
              >
                <Card
                  className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  
                  <div className="relative flex items-center gap-6 p-6">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${app.gradient} p-0.5`}>
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-900/90">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">{app.description}</p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex items-center gap-4 border-t border-gray-800 px-6 py-4">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-400">Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-xs text-gray-400">Kostenlos</span>
                    </div>
                  </div>

                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}