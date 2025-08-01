import React from 'react';

interface LineNumbersProps {
  content: string;
}

export function LineNumbers({ content }: LineNumbersProps) {
  const lineCount = content ? content.split('\n').length : 1;
  
  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-700 flex flex-col text-xs text-gray-500 font-mono">
      {Array.from({ length: lineCount }, (_, index) => (
        <div key={index} className="h-5 flex items-center justify-end pr-2 leading-5 flex-shrink-0">
          {index + 1}
        </div>
      ))}
    </div>
  );
}