import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function PdfToPptPage() {
  return (
    <GenericToolPage 
      title="PDF to PowerPoint" 
      description="Turn your PDF files into easy to edit PPTX slideshows."
      endpoint="/api/pdf/to-ppt"
      outputExtension="pptx"
    />
  );
}
