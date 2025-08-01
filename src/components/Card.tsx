import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gray-900/50 backdrop-blur-sm',
        'border border-gray-800/50',
        hover && [
          'transition-all duration-300',
          'hover:border-gray-700/50 hover:bg-gray-900/60',
          'hover:shadow-lg hover:shadow-purple-500/10',
        ],
        className
      )}
      {...props}
    />
  );
}