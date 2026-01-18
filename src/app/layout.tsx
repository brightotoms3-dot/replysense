import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/app-shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ReplySense - AI-Powered Assistant',
  description: 'Your personal AI assistant for replies and creative ideas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <Script src="https://pl28410351.effectivegatecpm.com/d0/46/78/d046788551f5517567244d570c6186c6.js" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
