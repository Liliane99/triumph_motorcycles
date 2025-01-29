"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Mail, Phone, User, Star } from "lucide-react";

type Client = {
  id: string;
  raisonSociale: string;
  email: string;
  phone: string;
  experience: string;
  motos?: Moto[];
  locations?: Moto[];
  conducteurs?: Conducteur[];
};

type Moto = {
  id: string;
  plaque: string;
  modele: string;
  annee: number;
  dernierKilometrage: number;
  image: string;
};

type Conducteur = {
  id: string;
  raisonSociale: string;
  experience: string;
  dateNaissance: string;
  moto: string; 
};

export function ClientDetails({ client }: { client: Client }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <User className="h-16 w-16 rounded-full bg-muted p-3" />
          <CardTitle className="mt-4 text-2xl font-bold">
            {client.raisonSociale}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <strong>Email :</strong> {client.email}
              </p>
              <p className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <strong>Téléphone :</strong> {client.phone}
              </p>
              <p className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-muted-foreground" />
                <strong>Niveau dexpérience :</strong> {client.experience}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {client.motos?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Motos associées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.motos.map((moto) => (
                <Card key={moto.id} className="p-4">
                  <Image
                    src={moto.image}
                    alt={`Moto ${moto.modele}`}
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                  <div className="mt-4 space-y-2">
                    <p><strong>Plaque :</strong> {moto.plaque}</p>
                    <p><strong>Modèle :</strong> {moto.modele}</p>
                    <p><strong>Année :</strong> {moto.annee}</p>
                    <p><strong>Dernier Kilométrage :</strong> {moto.dernierKilometrage} km</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {client.locations?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.locations.map((location) => (
                <Card key={location.id} className="p-4">
                  <Image
                    src={location.image}
                    alt={`Location ${location.modele}`}
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                  <div className="mt-4 space-y-2">
                    <p><strong>Plaque :</strong> {location.plaque}</p>
                    <p><strong>Modèle :</strong> {location.modele}</p>
                    <p><strong>Année :</strong> {location.annee}</p>
                    <p><strong>Dernier Kilométrage :</strong> {location.dernierKilometrage} km</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {client.conducteurs?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conducteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raison Sociale</TableHead>
                  <TableHead>Niveau expérience</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Moto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.conducteurs.map((conducteur) => (
                  <TableRow key={conducteur.id}>
                    <TableCell>{conducteur.raisonSociale}</TableCell>
                    <TableCell>{conducteur.experience}</TableCell>
                    <TableCell>{new Date(conducteur.dateNaissance).toLocaleDateString()}</TableCell>
                    <TableCell>{conducteur.moto}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
