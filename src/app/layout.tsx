import { Inter } from 'next/font/google';
import { cn, constructMetadata } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="light">
			<Providers>
				<body className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
					<Navbar />
					<Toaster />
					{children}
				</body>
			</Providers>
		</html>
	);
}
