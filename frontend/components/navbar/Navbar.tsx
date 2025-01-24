'use client'
import { useState } from 'react';
import Image from 'next/image';
import NavbarItems from './Navbar-items';
import Connexion from './Connexion';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-slate-200 px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Image 
                src="/logo2.png"
                alt="Logo"
                width={50}
                height={50}
            />
            
            {/* Items Desktop */}
            <div className="hidden md:flex space-x-12">
                <NavbarItems />
            </div>

            {/* Connexion */}
            <Connexion buttonClassName="hidden md:block hover:bg-yellow-400" />

            {/* Menu Burger pour mode mobile */}
            <div className="md:hidden text-back hover:text-yellow-400 transition-colors" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </div>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-slate-200 px-6 py-4 flex flex-col space-y-4 md:hidden items-center">
                    <Connexion buttonClassName="md:block hover:bg-yellow-400" />
                    <NavbarItems />
                </div>
            )}
        </nav>
    );
}
