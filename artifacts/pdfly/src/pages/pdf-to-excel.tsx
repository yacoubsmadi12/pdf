import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function PdfToExcelPage() {
  return (
    <GenericToolPage 
      title="PDF to Excel" 
      description="Convert PDF data to EXCEL spreadsheets. High quality and accurate conversions."
      endpoint="/api/pdf/to-excel"
      outputExtension="xlsx"
    />
  );
}
