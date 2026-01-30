
import React from 'react';
import '../globals.css';

export const metadata = {
  title: 'Holy Spirit Gym | Treine o Templo',
  description: 'A Holy Spirit Academia une performance física e bem-estar espiritual. Conteúdos exclusivos sobre musculação, nutrição e fé para transformar seu templo.',
};

// Fixed: children is made optional to satisfy TypeScript when children are provided via JSX 
// but not correctly inferred as props in certain environments.
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="antialiased bg-black text-white font-sans selection:bg-neon selection:text-black">
      {children}
    </div>
  );
}
