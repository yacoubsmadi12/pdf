import { Link } from "wouter";
import { Sun, Moon, Mail, Phone, Globe, Cpu, Network, Brain } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function AboutPage() {
  const { theme, toggle } = useTheme();

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
        <section className="py-16 md:py-24 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="w-36 h-36 rounded-full border-4 border-primary mx-auto mb-6 overflow-hidden shadow-xl">
              <img
                src="/developer.png"
                alt="Eng. Yacoub Smadi"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Eng. Yacoub Smadi</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A network engineer passionate about systems development with extensive experience
              in systems administration and AI.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Network Engineering</h3>
                <p className="text-sm text-muted-foreground">Deep expertise in designing and managing complex network infrastructures.</p>
              </div>
              <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Systems Administration</h3>
                <p className="text-sm text-muted-foreground">Extensive hands-on experience administering enterprise-grade systems.</p>
              </div>
              <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">AI & Development</h3>
                <p className="text-sm text-muted-foreground">Passionate about leveraging AI to build practical, impactful tools.</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-6">About PDFly</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PDFly was built with a simple goal: give everyone access to professional-grade PDF tools
                without barriers. No subscriptions, no sign-ups — just fast, reliable PDF processing
                that respects your privacy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every file you upload is processed server-side and deleted immediately after download.
                Your documents stay yours.
              </p>
            </div>

            <div className="mt-8 rounded-xl border bg-card p-8">
              <h2 className="text-2xl font-bold mb-6">Contact</h2>
              <div className="space-y-4">
                <a
                  href="tel:+962796734144"
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <p className="font-semibold group-hover:text-primary transition-colors">+962 796 734 144</p>
                  </div>
                </a>
                <a
                  href="mailto:yakupsmadi@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 hover:bg-muted transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="font-semibold group-hover:text-primary transition-colors">yakupsmadi@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDFly by Eng. Yacoub Smadi. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-2">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
