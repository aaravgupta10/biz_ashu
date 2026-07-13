import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Behavioral Intelligence Platform',
  description: 'Simulation dashboard for digital twins and synthetic humans',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
