import Nav from "@/components/navbar";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen flex items-center justify-center bg-gray-900">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/essai.png"
            alt="Moto background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          
          <h1 className="text-5xl font-extrabold text-white mb-8">
            Réserver un essai
          </h1>

          
          <div className="bg-black bg-opacity-70 p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-2xl font-semibold mb-4">Conditions pour réserver un essai</h3>
            <p className="text-lg mb-6">
              Pour réserver un essai, il vous suffit davoir un permis moto valide. Ensuite, il vous faudra vous rendre dans lune de nos boutiques Triumph Motorcycles pour compléter votre réservation.
            </p>
            <p className="text-lg mb-6">
              Avant de réserver un essai, nous vous recommandons de consulter les modèles disponibles dans notre rubrique moto pour choisir la moto qui vous intéresse.
            </p>

            <div className="mt-6">
              <a
                href="/moto"
                className="inline-block bg-yellow-400 text-black text-lg font-semibold py-3 px-8 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
              >
                Voir les modèles disponibles
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
