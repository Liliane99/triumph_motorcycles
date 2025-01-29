import Nav from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Nav />
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-left mb-8 border-b-2 border-gray-500 pb-2">
          SUZUKI GSF Bandit 650
        </h2>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <img
                      src="/images/moto-650-1.png"
                      alt="Suzuki Bandit 650 - Vue 1"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="/images/moto-650-2.png"
                      alt="Suzuki Bandit 650 - Vue 2"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="/images/moto-650-3.png"
                      alt="Suzuki Bandit 650 - Vue 3"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300" />
                <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow hover:bg-gray-300" />
              </Carousel>
            </div>
          </div>

         
          <div className="flex flex-col justify-between">
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                Moto au caractère bien trempé, alliant puissance, confort et maniabilité. Ce modèle emblématique de la
                marque japonaise est idéal pour les motards à la recherche dune machine polyvalente qui excelle aussi
                bien en ville que sur les routes sinueuses. Son moteur bicylindre en ligne de 650 cm³ délivre une
                puissance impressionnante tout en restant accessible aux pilotes de tous niveaux.
              </p>
            </div>

            
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Caractéristiques</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li>Moteur bicylindre en ligne de 650 cm³</li>
                <li>Puissance impressionnante et maniabilité</li>
                <li>Confort optimal pour les longs trajets</li>
                <li>Polyvalence : parfait en ville et sur route</li>
                <li>Design emblématique et intemporel</li>
              </ul>
            </div>

            
            <div className="mt-8">
                <Link href="/moto" className="w-full">
                    <Button className="w-full">
                        Retour
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
