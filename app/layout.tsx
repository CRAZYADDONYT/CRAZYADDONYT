import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Daily',
  description: 'Motivational study landing page inspired by the provided Canva design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
