import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function PdfToWordPage() {
  return (
    <GenericToolPage 
      title="PDF to Word" 
      description="Easily convert your PDF files into easy to edit DOCX documents."
      endpoint="/api/pdf/to-word"
      outputExtension="docx"
    />
  );
}
