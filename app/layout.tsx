import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Khata — Split the Bill',
  description:
    'Fair bill splitting for groups — tax, tip, and itemized shares. Who owes what, settled fair.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: '#1C1A17' }}>{children}</body>
    </html>
  );
}
