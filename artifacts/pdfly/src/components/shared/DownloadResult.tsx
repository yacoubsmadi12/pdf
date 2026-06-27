import React from 'react';
import { Download, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadResultProps {
  url: string;
  filename: string;
  filesize?: string;
  onReset: () => void;
}

export function DownloadResult({ url, filename, filesize, onReset }: DownloadResultProps) {
  React.useEffect(() => {
    // Auto-download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [url, filename]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center bg-muted/20 border rounded-xl">
      <div className="p-4 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <FileCheck2 className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Task complete!</h3>
        <p className="text-muted-foreground">Your file is ready to download.</p>
        {filesize && <p className="text-sm font-medium text-foreground">{filename} ({filesize})</p>}
      </div>
      <div className="flex gap-4">
        <Button size="lg" className="gap-2" asChild>
          <a href={url} download={filename}>
            <Download className="w-5 h-5" /> Download File
          </a>
        </Button>
        <Button size="lg" variant="outline" onClick={onReset}>
          Process Another
        </Button>
      </div>
    </div>
  );
}
