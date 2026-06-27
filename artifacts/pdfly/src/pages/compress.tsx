import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CompressPdfPage() {
  return (
    <GenericToolPage 
      title="Compress PDF" 
      description="Reduce file size while optimizing for maximal PDF quality."
      endpoint="/api/pdf/compress"
      extraFields={
        <div className="space-y-3">
          <Label htmlFor="level">Compression Level</Label>
          <Select name="level" defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Less compression, high quality)</SelectItem>
              <SelectItem value="medium">Medium (Good compression, good quality)</SelectItem>
              <SelectItem value="high">High (Maximum compression, lower quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}
