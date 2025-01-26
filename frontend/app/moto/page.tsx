import Nav from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";

export default function Page() {
  return (
    <>
      <Nav />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <Input placeholder="Rechercher une moto" className="flex-1" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Prix croissant</SelectItem>
              <SelectItem value="dark">Prix décroissant</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle>SUZUKI GSF Bandit 650</CardTitle>
                <img
                  src="/images/suzuki-bandit-650.png"
                  alt="Suzuki Bandit 650"
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <CardDescription>
                  Moto au caractère bien trempé, alliant puissance, confort et maniabilité. Ce modèle emblématique de la
                  marque japonaise est idéal pour les motards à la recherche d'une machine polyvalente qui excelle aussi
                  bien en ville que sur les routes sinueuses. Son moteur bicylindre en ligne de 650 cm³ délivre une
                  puissance impressionnante tout en restant accessible aux pilotes de tous niveaux.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>À partir de 5895 €</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Voir la fiche</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>

      </div>
    </>
  );
}