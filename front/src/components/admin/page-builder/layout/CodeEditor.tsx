import React from 'react';
import Editor from '@monaco-editor/react';
import { Code } from 'lucide-react';

interface CodeEditorProps {
  htmlCode: string;
  onCodeChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ htmlCode, onCodeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-3 bg-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">Editor de Código HTML</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs bg-green-600 px-2 py-1 rounded">
            ✅ Tailwind Preservado
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(htmlCode);
              alert('✅ HTML copiado!');
            }}
            className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            📋 Copiar
          </button>
          <span className="text-xs text-gray-400">
            {htmlCode.split('\n').length} linhas
          </span>
        </div>
      </div>
      <Editor
        height="600px"
        language="html"
        value={htmlCode}
        onChange={(value) => onCodeChange(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};