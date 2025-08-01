import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

export function MonacoTextEditor({ 
  value, 
  onChange, 
  readOnly = false, 
  height = '400px',
  placeholder = ''
}: MonacoTextEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height={height}
      defaultLanguage="plaintext"
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
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        placeholder: placeholder,
      }}
    />
  );
}