import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function OfficeToPdfPage() {
  return (
    <GenericToolPage 
      title="Office to PDF" 
      description="Convert Word, Excel and PowerPoint files to PDF documents."
      endpoint="/api/office/to-pdf"
      accept=".docx,.xlsx,.pptx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      outputExtension="pdf"
    />
  );
}
