import React from 'react';
import { cn } from '../utils/cn';

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}