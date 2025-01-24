import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function Navbar() {
    return (
        <nav className="fixed w-full top-0 z-50 bg-slate-200 px-6 py-4 flex items-center justify-between">
            {/* Logo */} 
            <Image 
                src="/logo2.png"
                alt="Logo"
                width={50}
                height={50}
            />
            
            {/* Items */}
            <div className="hidden md:flex space-x-12">
                <Link href="/" className="text-back hover:text-yellow-400 transition-colors">
                    Nos motos
                </Link>
                <Link href="/" className="text-back hover:text-yellow-400 transition-colors">
                    Essayer
                </Link>
                <Link href="/" className="text-back hover:text-yellow-400 transition-colors">
                    Pièces détachées
                </Link>
                <Link href="/" className="text-back hover:text-yellow-400 transition-colors">
                    Entretiens
                </Link>
            </div>

            {/* Connexion */}
            <Link href="/login">  
                <Button className="hidden md:block hover:bg-yellow-400"> Connexion </Button>
            </Link>

            {/* Menu Burger pour mode mobile */}
            <div className="md:hidden text-back hover:text-yellow-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </div>      
        </nav>
    );
}