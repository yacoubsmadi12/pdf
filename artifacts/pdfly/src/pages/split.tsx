import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function SplitPdfPage() {
  return (
    <GenericToolPage 
      title="Split PDF" 
      description="Separate one page or a whole set for easy conversion into independent PDF files."
      endpoint="/api/pdf/split"
      outputExtension="zip"
    />
  );
}
