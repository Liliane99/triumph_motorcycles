"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Mail, Phone, Star, Calendar, User } from "lucide-react";

type Client = {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  licenseNumber?: string;
  experienceLevel?: string;
};

export function ClientDetails({ client, createdByName, updatedByName }: { client: Client; createdByName: string; updatedByName: string }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <User className="h-16 w-16 rounded-full bg-muted p-3" />
          <CardTitle className="mt-4 text-2xl font-bold">
            {client.username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <strong>Email :</strong> {client.email}
              </p>
              {client.phoneNumber && (
                <p className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <strong>Téléphone :</strong> {client.phoneNumber}
                </p>
              )}
              {client.licenseNumber && (
                <p className="flex items-center gap-2 text-lg">
                  <strong>Plaque d'immatriculation :</strong> {client.licenseNumber}
                </p>
              )}
              {client.experienceLevel && (
                <p className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <strong>Niveau d'expérience :</strong> {client.experienceLevel}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <strong>Créé le :</strong> {new Date().toLocaleString()}
              </p>
              <p className="flex items-center gap-2 text-lg">
                <strong>Créé par :</strong> {createdByName}
              </p>
              <p className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <strong>Modifié le :</strong> {new Date().toLocaleString()}
              </p>
              <p className="flex items-center gap-2 text-lg">
                <strong>Modifié par :</strong> {updatedByName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Motos associées</CardTitle>
        </CardHeader>
        <CardContent>
          <Image src="/images/moto1.jpg" alt="Moto" width={300} height={200} className="rounded-md" />
          <p><strong>Plaque :</strong> AA-123-BB</p>
          <p><strong>Modèle :</strong> Yamaha MT-07</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Image src="/images/moto2.jpg" alt="Moto" width={300} height={200} className="rounded-md" />
          <p><strong>Plaque :</strong> CC-345-DD</p>
          <p><strong>Modèle :</strong> Kawasaki Z650</p>
        </CardContent>
      </Card>

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
              <TableRow>
                <TableCell>Hamid Amchich</TableCell>
                <TableCell>Intermédiaire</TableCell>
                <TableCell>15/06/1995</TableCell>
                <TableCell>AA-123-BB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sophie Dupont</TableCell>
                <TableCell>Avancé</TableCell>
                <TableCell>22/03/1990</TableCell>
                <TableCell>CC-345-DD</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
