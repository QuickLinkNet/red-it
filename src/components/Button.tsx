import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-lg transition-all duration-300',
        'before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:transition-all before:duration-500',
        variant === 'primary' && [
          'text-white before:from-purple-600 before:to-blue-500',
          'hover:before:opacity-90',
          'active:before:opacity-80',
        ],
        variant === 'secondary' && [
          'border border-gray-700 bg-gray-900 text-gray-300',
          'hover:bg-gray-800 hover:text-white',
          'active:bg-gray-700',
        ],
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        className
      )}
      {...props}
    >
      <span className="relative">{props.children}</span>
    </button>
  );
}