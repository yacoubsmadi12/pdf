import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MergePdfPage from "@/pages/merge";
import SplitPdfPage from "@/pages/split";
import CompressPdfPage from "@/pages/compress";
import PdfToWordPage from "@/pages/pdf-to-word";
import PdfToExcelPage from "@/pages/pdf-to-excel";
import PdfToPptPage from "@/pages/pdf-to-ppt";
import OfficeToPdfPage from "@/pages/office-to-pdf";
import RotatePdfPage from "@/pages/rotate";
import WatermarkPage from "@/pages/watermark";
import PageNumbersPage from "@/pages/page-numbers";
import UnlockPdfPage from "@/pages/unlock";
import ProtectPdfPage from "@/pages/protect";
import ExtractImagesPage from "@/pages/extract-images";
import PdfToJpgPage from "@/pages/pdf-to-jpg";
import JpgToPdfPage from "@/pages/jpg-to-pdf";
import AboutPage from "@/pages/about";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/merge" component={MergePdfPage} />
      <Route path="/split" component={SplitPdfPage} />
      <Route path="/compress" component={CompressPdfPage} />
      <Route path="/pdf-to-word" component={PdfToWordPage} />
      <Route path="/pdf-to-excel" component={PdfToExcelPage} />
      <Route path="/pdf-to-ppt" component={PdfToPptPage} />
      <Route path="/office-to-pdf" component={OfficeToPdfPage} />
      <Route path="/rotate" component={RotatePdfPage} />
      <Route path="/watermark" component={WatermarkPage} />
      <Route path="/page-numbers" component={PageNumbersPage} />
      <Route path="/unlock" component={UnlockPdfPage} />
      <Route path="/protect" component={ProtectPdfPage} />
      <Route path="/extract-images" component={ExtractImagesPage} />
      <Route path="/pdf-to-jpg" component={PdfToJpgPage} />
      <Route path="/jpg-to-pdf" component={JpgToPdfPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
