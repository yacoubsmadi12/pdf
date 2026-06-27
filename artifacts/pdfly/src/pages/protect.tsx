import React from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProtectPdfPage() {
  return (
    <GenericToolPage 
      title="Protect PDF" 
      description="Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access."
      endpoint="/api/pdf/protect"
      extraFields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input name="password" type="password" required placeholder="Type a secure password" />
          </div>
        </div>
      }
    />
  );
}
