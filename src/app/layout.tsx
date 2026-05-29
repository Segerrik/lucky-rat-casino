import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lucky Rat Casino',
  description: 'The luckiest rats play here',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#121212', margin: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}