import Nav from "@/components/navbar";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen flex items-center justify-center bg-gray-900">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/apropos.png"
            alt="Moto background"
            fill
            className="object-cover opacity-60" // Ajuste l'opacité pour une meilleure lisibilité du texte
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 text-center px-6 py-16 md:py-24 bg-black bg-opacity-70 rounded-2xl shadow-2xl max-w-4xl mx-auto transition-all duration-500 transform hover:scale-105">
          {/* Titre principal avec animation */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-snug animate__animated animate__fadeInUp">
            TRIUMPH <span className="text-yellow-400">MOTORCYCLES</span>
          </h1>

          {/* Paragraphe amélioré */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Depuis notre création, Triumph Motorcycles s'engage à transformer la gestion des flottes de motos pour les concessionnaires et leurs clients. Découvrez comment notre plateforme innovante peut vous aider à optimiser vos opérations et à suivre vos motos en toute simplicité.
          </p>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Triumph Motorcycles a développé une plateforme dédiée aux concessionnaires pour améliorer la gestion des motos utilisées par leurs clients et partenaires (livreurs, coursiers, services de location, etc.). Cette solution vous aide à gérer vos flottes de manière plus efficace, en simplifiant les tâches administratives et en optimisant la maintenance des motos.
          </p>
        </div>
      </main>
    </>
  );
}
