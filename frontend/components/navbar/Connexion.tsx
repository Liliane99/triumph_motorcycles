import Link from 'next/link';
import { Button } from '../ui/button';

interface ConnexionProps {
    buttonClassName?: string;
}

export default function Connexion({ buttonClassName }: ConnexionProps) {
    return (
        <Link href="/login">  
            <Button className={buttonClassName}> Connexion </Button>
        </Link>
    );
}