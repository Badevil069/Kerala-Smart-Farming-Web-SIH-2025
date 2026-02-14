import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import ConditionalChatbot from '@/components/shared/conditional-chatbot';
import AppContent from '@/components/shared/app-content';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Krishi Sakhi',
  description: 'AI-Powered Personal Farming Assistant for Kerala Farmers',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <AppProvider>
          <AppContent>
            {children}
          </AppContent>
          <ConditionalChatbot />
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
