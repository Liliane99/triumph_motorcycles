import Link from 'next/link';

export default function NavbarItems() {
    return <>
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
    </>
}