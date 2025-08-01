import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

export function MonacoCodeEditor({ 
  value, 
  onChange, 
  language,
  readOnly = false, 
  height = '400px' 
}: MonacoCodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // Map our language names to Monaco language identifiers
  const getMonacoLanguage = (lang: string) => {
    const languageMap = {
      html: 'html',
      css: 'css',
      javascript: 'javascript',
      typescript: 'typescript',
      php: 'php'
    };
    return languageMap[lang as keyof typeof languageMap] || 'plaintext';
  };

  return (
    <Editor
      height={height}
      defaultLanguage={getMonacoLanguage(language)}
      language={getMonacoLanguage(language)}
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