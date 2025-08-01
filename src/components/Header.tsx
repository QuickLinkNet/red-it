import React from 'react';
import { Container } from './Container';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold text-white"
          >
            <Code2 className="h-8 w-8 text-purple-500" />
            <span>red-it.org</span>
          </Link>
        </nav>
      </Container>
    </header>
  );
}