import React from 'react';
import { Container } from './Container';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold text-white transition-colors hover:text-purple-500"
            >
              <Code2 className="h-8 w-8 text-purple-500" />
              <span>red-it.org</span>
            </Link>
            <span className="text-sm text-gray-400">
              © {new Date().getFullYear()} Alle Rechte vorbehalten.
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://ko-fi.com/quicklink"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <span>☕</span>
              <span>Unterstützen auf Ko-fi</span>
            </a>
            <div className="h-4 w-px bg-gray-800" />
            <Link
              to="/impressum"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Impressum
            </Link>
            <div className="h-4 w-px bg-gray-800" />
            <Link
              to="/datenschutz"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}