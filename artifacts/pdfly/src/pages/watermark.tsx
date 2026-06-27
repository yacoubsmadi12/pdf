import React, { useState } from 'react';
import GenericToolPage from '@/components/shared/GenericToolPage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export default function WatermarkPage() {
  const [opacity, setOpacity] = useState(0.5);

  return (
    <GenericToolPage 
      title="Add Watermark" 
      description="Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position."
      endpoint="/api/pdf/watermark"
      extraFields={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Watermark Text</Label>
            <Input name="text" required placeholder="CONFIDENTIAL" />
          </div>
          
          <div className="space-y-2">
            <Label>Opacity</Label>
            <Slider 
              value={[opacity]} 
              onValueChange={(vals) => setOpacity(vals[0])} 
              max={1} 
              step={0.1} 
            />
            <input type="hidden" name="opacity" value={opacity} />
            <div className="text-xs text-muted-foreground text-right">{Math.round(opacity * 100)}%</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size (px)</Label>
            <Input name="fontSize" type="number" defaultValue="48" min="10" max="200" />
          </div>
        </div>
      }
    />
  );
}
