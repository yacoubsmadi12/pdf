import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function PdfToJpgPage() {
  return (
    <GenericToolPage 
      title="PDF to JPG" 
      description="Convert each PDF page into a JPG or extract all images contained in a PDF."
      endpoint="/api/pdf/to-jpg"
      outputExtension="zip"
    />
  );
}
