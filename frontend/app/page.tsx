import Nav from "../components/navbar";
import { Button } from "@/components/ui/button";
import  Link  from "next/link";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      <Nav />
      <main className="relative min-h-screen flex items-center justify-center">
        {/* Image de fond avec effet parallaxe */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/moto1.jpg"
            alt="Moto background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            TRIUMPH <span className="text-yellow-400">MOTORCYCLES</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12">
            Découvrez notre collection exclusive de motos et vivez une expérience unique
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link  href="/moto">
              <Button className="px-8 py-6 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors">
                Découvrir nos motos
              </Button>
            </Link>
            <Link href="/essaie">
              <Button className="px-8 py-6 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors">
                Essayer une moto
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}