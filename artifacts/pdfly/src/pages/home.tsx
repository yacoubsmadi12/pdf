import React from 'react';
import { Link } from 'wouter';
import { useListTools } from '@workspace/api-client-react';
import { Search, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AdSlot } from '@/components/shared/AdSlot';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export default function Home() {
  const { data: tools } = useListTools();
  const [search, setSearch] = React.useState('');
  const { theme, toggle } = useTheme();

  const filteredTools = tools?.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const firstRow = filteredTools?.slice(0, 4) ?? [];
  const remainingRows = filteredTools?.slice(4) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl tracking-tight text-primary flex items-center gap-2">
            <span className="bg-primary text-primary-foreground p-1 rounded-md">PDF</span>ly
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-muted/20 border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Every tool you need to work with PDFs in one place</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                className="pl-10 h-14 text-lg rounded-full bg-background" 
                placeholder="Search for a tool..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 flex flex-col items-center">

          {/* Ad #1 — Above the tools grid */}
          <AdSlot slot="4179017768" format="auto" fullWidthResponsive />

          <div className="w-full max-w-6xl mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {firstRow.map(tool => (
              <Link key={tool.id} href={tool.route}>
                <div className="group h-full p-6 bg-card border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-bold text-lg">{tool.icon.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Ad #2 — Amidst the rows of tools (after first row) */}
          {remainingRows.length > 0 && (
            <AdSlot
              slot="2674364407"
              format="fluid"
              layoutKey="-6t+ed+2i-1n-4w"
              className="w-full max-w-6xl"
            />
          )}

          {remainingRows.length > 0 && (
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {remainingRows.map(tool => (
                <Link key={tool.id} href={tool.route}>
                  <div className="group h-full p-6 bg-card border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="font-bold text-lg">{tool.icon.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Ad #3 — Bottom of the page */}
          <AdSlot slot="1393493784" format="auto" fullWidthResponsive className="mt-8" />
        </div>
      </main>

      <footer className="border-t bg-muted/20 pt-16 pb-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Your files are deleted automatically after processing.
          </div>
          <div className="w-full h-px bg-border max-w-xl" />
          <div className="text-center text-sm text-muted-foreground space-y-4">
            <p>&copy; {new Date().getFullYear()} PDFly. All rights reserved.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/about" className="hover:text-foreground transition-colors">About Developer</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
