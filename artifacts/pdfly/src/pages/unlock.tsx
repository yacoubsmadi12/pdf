import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function UnlockPdfPage() {
  return (
    <GenericToolPage 
      title="Unlock PDF" 
      description="Remove PDF password security, giving you the freedom to use your PDFs as you want."
      endpoint="/api/pdf/unlock"
      extraFields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Current Password</Label>
            <Input name="password" type="password" required placeholder="Enter the password to unlock" />
          </div>
        </div>
      }
    />
  );
}
