import React from 'react';

interface PreviewProps {
  htmlContent: string;
}

export const Preview: React.FC<PreviewProps> = ({ htmlContent }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-auto">
      <div className="p-4 bg-gray-100 border-b">
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="p-4"
      />
    </div>
  );
};