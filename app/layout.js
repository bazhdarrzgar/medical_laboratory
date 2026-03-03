import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { FontSizeProvider } from "@/context/FontSizeContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition"
import localFont from "next/font/local";
import "./globals.css";

const enFont = localFont({
  src: "../fonts/en/MonoLisa-normal.ttf",
  variable: "--font-en",
});

const kuFont = localFont({
  src: "../fonts/ckb/72_Sarchia_Qaisy.ttf",
  variable: "--font-ku",
});

const arFont = localFont({
  src: "../fonts/ar/alfont_com_PingARLT-Bold.otf",
  variable: "--font-ar",
});

export const metadata = {
  title: "Laboratory Management System",
  description: "Advanced Laboratory Management System for Medical Labs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${enFont.variable} ${kuFont.variable} ${arFont.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-brand/20`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              <FontSizeProvider>
                <AuthGuard>
                  <div className="flex flex-col h-screen overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-auto bg-background shadow-inner relative z-0">
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </main>
                    {/* Footer bar like in the images */}
                    <div className="h-7 bg-muted/80 backdrop-blur-sm border-t border-border flex items-center justify-between px-6 text-smaller text-muted-foreground uppercase tracking-[0.3em] font-extrabold">
                      <div>Laboratory Management System - v1.0</div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ONLINE</span>
                        <span>SYSTEM READY</span>
                      </div>
                    </div>
                  </div>
                </AuthGuard>
              </FontSizeProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
