import React from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
}

export function FileDropZone({
  onFilesSelected,
  accept = 'application/pdf',
  multiple = false,
  maxSizeMB = 50,
  className,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => {
      // Basic size check
      return file.size <= maxSizeMB * 1024 * 1024;
    });
    
    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-full min-h-[300px] p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer bg-muted/20',
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50 hover:border-primary/50',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <UploadCloud className="w-10 h-10" />
        </div>
        <div>
          <p className="text-xl font-semibold">
            Choose file{multiple && 's'} or drop here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Max {maxSizeMB}MB per file
          </p>
        </div>
      </div>
    </div>
  );
}
