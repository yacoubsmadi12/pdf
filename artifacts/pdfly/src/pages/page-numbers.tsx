import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function PageNumbersPage() {
  return (
    <GenericToolPage 
      title="Add Page Numbers" 
      description="Add page numbers into PDFs with ease. Choose your positions, dimensions, typography."
      endpoint="/api/pdf/page-numbers"
      extraFields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select name="position" defaultValue="bottom-center">
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-center">Top Center</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startFrom">Start From</Label>
            <Input name="startFrom" type="number" defaultValue="1" min="1" />
          </div>
        </div>
      }
    />
  );
}
