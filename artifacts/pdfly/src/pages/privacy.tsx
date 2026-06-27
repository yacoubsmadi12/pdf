import { Link } from "wouter";
import { Sun, Moon, ShieldCheck } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function PrivacyPage() {
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

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground text-sm mt-1">Last updated: June 2025</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
              <p className="font-semibold text-foreground">
                Your privacy is our top priority. PDFly is designed from the ground up to process your files without ever storing them.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-3">1. File Handling</h2>
              <p className="text-muted-foreground leading-relaxed">
                All files you upload to PDFly are processed entirely in memory on our servers. We do not write your files
                to permanent storage at any point. Immediately after your processed file is returned to you, all data
                associated with your upload is permanently discarded. We have no ability to retrieve your files after processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Information We Do Not Collect</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li>We do not collect, store, or analyze the content of your files.</li>
                <li>We do not require registration or login of any kind.</li>
                <li>We do not sell or share your data with third parties.</li>
                <li>We do not use your files for machine learning or any automated analysis.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Technical Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                Like most web services, our servers may log basic technical information such as your IP address,
                browser type, and the pages you visit. This information is used solely for server security and
                performance monitoring. It is never linked to your uploaded files.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                PDFly uses a single cookie to remember your dark/light mode preference. No tracking cookies,
                advertising cookies, or third-party analytics cookies are set without your knowledge. If we add
                Google AdSense in the future, AdSense may set its own cookies according to Google's privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                PDFly may display advertisements served by Google AdSense. These are clearly marked as
                "Advertisement" on the page. Google's use of advertising cookies enables it to serve ads
                based on users' visits to PDFly and other sites. You may opt out of personalized advertising
                by visiting Google's Ads Settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. File Size Limits</h2>
              <p className="text-muted-foreground leading-relaxed">
                To protect server performance and your experience, uploaded files are limited to 50MB per file.
                Files exceeding this limit are rejected and never stored.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be reflected on this page
                with an updated date. Continued use of PDFly after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:yakupsmadi@gmail.com" className="text-primary hover:underline font-medium">
                  yakupsmadi@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/20 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDFly by Eng. Yacoub Smadi. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-2">
            <Link href="/about" className="hover:text-foreground transition-colors">About Developer</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
