import type {Metadata} from 'next';
import './globals.css';
import {ReactNode} from 'react';
import {unbounded} from '@/src/lib/fonts';

export const metadata: Metadata = {
	title: "Dream!",
};


export default function RootLayout({children}: Readonly<{ children: ReactNode; }>) {
	return (
	  <html lang="en">
	  <body className={`${unbounded.className} bg-slate-200`}>{children}</body>
	  </html>
	);
}
