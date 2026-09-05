import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/lib/wallet/provider';
import { Nav } from '@/components/nav';
export const metadata: Metadata = { title: 'Cantrap — contained adversarial benchmark', description: 'A GenLayer sandbox for reproducible prompt-injection tests.' };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><WalletProvider><Nav/>{children}</WalletProvider></body></html>}
