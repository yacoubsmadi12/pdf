import { Link } from "wouter";
import { Sun, Moon, ScrollText } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function TermsPage() {
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
              <ScrollText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground text-sm mt-1">Last updated: June 2025</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
              <p className="font-semibold text-foreground">
                By using PDFly, you agree to these terms. Please read them carefully. PDFly is a free service — use it responsibly.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using PDFly ("the Service"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                PDFly provides free, server-side PDF processing tools including merging, splitting, compressing,
                converting, rotating, watermarking, and securing PDF files. All tools are provided free of charge,
                with no account registration required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You agree to use PDFly only for lawful purposes. You must not:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li>Upload files that contain illegal, harmful, or infringing content.</li>
                <li>Attempt to reverse-engineer, overload, or disrupt the service.</li>
                <li>Use the service to process files belonging to others without their permission.</li>
                <li>Automate excessive requests that degrade performance for other users.</li>
                <li>Upload files containing malware, viruses, or other harmful code.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. File Uploads and Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain full ownership and all rights to any files you upload to PDFly. By uploading a file,
                you confirm that you have the legal right to process that file. PDFly claims no ownership over
                your uploaded content and does not store it beyond the duration required to complete processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. File Size and Usage Limits</h2>
              <p className="text-muted-foreground leading-relaxed">
                Files are limited to 50MB per upload. We reserve the right to impose additional rate limits
                or usage restrictions to maintain service quality for all users. These limits may change at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                PDFly is provided "as is" without warranties of any kind, express or implied. We do not guarantee
                that the service will be uninterrupted, error-free, or that processing results will always meet
                your expectations. Use the service at your own risk. Always keep a backup of important files
                before processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, PDFly and its developer shall not be liable for any
                indirect, incidental, special, or consequential damages arising out of your use of the service,
                including but not limited to data loss, file corruption, or inability to access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify these Terms at any time. Updated terms will be posted on this page with a revised
                date. Continued use of PDFly after any changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard
                to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions about these Terms of Service, contact{" "}
                <a href="mailto:yakupsmadi@gmail.com" className="text-primary hover:underline font-medium">
                  yakupsmadi@gmail.com
                </a>{" "}
                or call{" "}
                <a href="tel:+962796734144" className="text-primary hover:underline font-medium">
                  +962 796 734 144
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
