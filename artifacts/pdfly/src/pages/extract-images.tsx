import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';

export default function ExtractImagesPage() {
  return (
    <GenericToolPage 
      title="Extract Images" 
      description="Extract all images contained in a PDF into high quality JPGs."
      endpoint="/api/pdf/extract-images"
      outputExtension="zip"
    />
  );
}
