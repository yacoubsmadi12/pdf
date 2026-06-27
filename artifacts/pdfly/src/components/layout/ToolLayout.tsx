import React from 'react';
import { Link } from 'wouter';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { AdSlot } from '../shared/AdSlot';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link href="/" className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
              <span className="bg-primary text-primary-foreground p-1 rounded-md">PDF</span>ly
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <AdSlot type="banner" />
        
        <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground">{description}</p>
          </div>
          
          <div className="w-full">
            {children}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 py-2 px-4 rounded-full border">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Files are deleted immediately after processing for your privacy.</span>
          </div>
        </div>
        
        <AdSlot type="responsive" className="mt-auto" />
      </main>

      <footer className="border-t bg-muted/20 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDFly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
