import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Wadul Bupati - Portal Aduan Masyarakat Kabupaten Kudus',
  description: 'Portal Resmi Pengaduan dan Aspirasi Masyarakat Kabupaten Kudus yang dikelola oleh Dinas Komunikasi dan Informatika (Diskominfo) Kabupaten Kudus.',
  keywords: ['wadul bupati', 'kudus', 'pengaduan kudus', 'diskominfo kudus', 'aspirasi rakyat'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
