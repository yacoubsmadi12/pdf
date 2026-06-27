import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function RotatePdfPage() {
  return (
    <GenericToolPage 
      title="Rotate PDF" 
      description="Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!"
      endpoint="/api/pdf/rotate"
      extraFields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="angle">Rotation Angle</Label>
            <Select name="angle" defaultValue="90">
              <SelectTrigger>
                <SelectValue placeholder="Select angle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 Degrees (Clockwise)</SelectItem>
                <SelectItem value="180">180 Degrees</SelectItem>
                <SelectItem value="270">270 Degrees (Counter-clockwise)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pages">Pages to Rotate (Optional)</Label>
            <Input name="pages" placeholder="e.g. 1,3,5 or 1-5" />
            <p className="text-xs text-muted-foreground">Leave empty to rotate all pages.</p>
          </div>
        </div>
      }
    />
  );
}
