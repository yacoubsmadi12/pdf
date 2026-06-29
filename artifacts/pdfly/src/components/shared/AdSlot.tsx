import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type AdSlotProps = {
  slot: string;
  format?: 'auto' | 'fluid';
  layoutKey?: string;
  layout?: string;
  fullWidthResponsive?: boolean;
  textAlign?: 'center';
  className?: string;
};

export function AdSlot({
  slot,
  format = 'auto',
  layoutKey,
  layout,
  fullWidthResponsive,
  textAlign,
  className,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  const insStyle: React.CSSProperties = {
    display: 'block',
    ...(textAlign === 'center' && { textAlign: 'center' }),
  };

  return (
    <div style={{ width: '100%', margin: '16px 0' }} className={cn('text-center', className)}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={insStyle}
        data-ad-client="ca-pub-1493226158255742"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(fullWidthResponsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
}
