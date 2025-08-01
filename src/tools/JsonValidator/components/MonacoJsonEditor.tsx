import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function MonacoJsonEditor({ 
  value, 
  onChange, 
  readOnly = false, 
  height = '400px' 
}: MonacoJsonEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height={height}
      defaultLanguage="json"
      value={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}