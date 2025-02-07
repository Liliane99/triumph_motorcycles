import { RentalRepository } from '../../../../application/ports/repositories/RentalRepository';
import { Rental } from '../../../../domain/entities/Rental';
import { PrismaClient } from '@prisma/client';
import { User } from '../../../../domain/entities/User';
import { Motorcycle } from '../../../../domain/entities/Motorcycle';
import { RentalReference } from '../../../../domain/values/Rental/rentalReference';

const prisma = new PrismaClient();

export class RentalRepositoryImpl implements RentalRepository {

  private mapToRental(prismaRental: any): Rental {
    return new Rental(
      prismaRental.id,
      new RentalReference(prismaRental.reference).getReference(),
      new Date(prismaRental.rentalDate),  
      Number(prismaRental.price),  
      new User(
        prismaRental.client.id,
        prismaRental.client.user_name,
        prismaRental.client.email,
        prismaRental.client.password,
        prismaRental.client.role,
        prismaRental.client.phone_number,
        prismaRental.client.created_by,
        prismaRental.client.updated_by,
        prismaRental.client.created_at,
        prismaRental.client.updated_at
      ),
      new Motorcycle(
        prismaRental.motorcycle.id,
        prismaRental.motorcycle.brand,
        prismaRental.motorcycle.model,
        prismaRental.motorcycle.purchaseDate,
        prismaRental.motorcycle.licensePlate,
        prismaRental.motorcycle.kilometers,
        prismaRental.motorcycle.warrantyDate,
        prismaRental.motorcycle.maintenanceInterval,
        prismaRental.motorcycle.userId,
      ), 
      prismaRental.userId,
    );
  }

  async save(rental: Rental): Promise<Rental> {
    console.log("Attempting to save rental:", rental);
    
    const rentalDateParsed = rental.rentalDate instanceof Date ? rental.rentalDate : new Date(rental.rentalDate);
    if (isNaN(rentalDateParsed.getTime())) {
      throw new Error(`Invalid rentalDate value. Expected a valid Date, got: ${rental.rentalDate}`);
    }

    const priceParsed = Number(rental.price);
    if (isNaN(priceParsed)) {
      throw new Error(`Invalid price value. Expected a number, got: ${rental.price}`);
    }

    console.log("➡️ Rental Reference:", rental.reference.getReference());
    console.log("➡️ Rental Date (Parsed):", rentalDateParsed);
    console.log("➡️ Rental Price (Parsed):", priceParsed);
    console.log("➡️ Client ID:", rental.client.id);
    console.log("➡️ Motorcycle ID:", rental.motorcycle.id);

    const existingRental = await prisma.rental.findUnique({
      where: { reference: rental.reference.getReference() },
    });

    if (existingRental) {
      console.log("Existing rental found, updating...");
      const updatedRental = await prisma.rental.update({
        where: { id: rental.id },
        data: {
          reference: rental.reference.getReference(),
          rentalDate: rentalDateParsed, 
          price: priceParsed,
          clientId: rental.client.id,
          motorcycleId: rental.motorcycle.id,
          updatedAt: new Date(), 
          updatedBy: rental.updatedBy,
        },
        include: {
          client: true,
          motorcycle: true,
        },
      });

      return this.mapToRental(updatedRental);
    }

    console.log("No existing rental found, creating new...");
    const newRental = await prisma.rental.create({
      data: {
        reference: rental.reference.getReference(),
        rentalDate: rentalDateParsed,  
        price: priceParsed,
        clientId: rental.client.id,
        motorcycleId: rental.motorcycle.id,
        createdAt: new Date(), 
        updatedAt: new Date(), 
        createdBy: rental.createdBy,
      },
      include: {
        client: true,
        motorcycle: true,
      },
    });

    return this.mapToRental(newRental);
  }

  async findById(id: string): Promise<Rental | null> {
    console.log(` Looking for rental with ID: ${id}`);
    const prismaRental = await prisma.rental.findUnique({
      where: { id },
      include: {
        client: true,
        motorcycle: true,
      },
    });

    if (!prismaRental) {
      console.log("Rental not found.");
      return null;
    }

    console.log("Rental found:", prismaRental);
    return this.mapToRental(prismaRental);
  }

  async getAll(): Promise<Rental[]> {
    console.log("Fetching all rentals...");
    const prismaRentals = await prisma.rental.findMany({
      include: {
        client: true,
        motorcycle: true,
      },
    });

    console.log(`Found ${prismaRentals.length} rentals.`);
    return prismaRentals.map(this.mapToRental);
  }

  async delete(id: string): Promise<void> {
    console.log(`Attempting to delete rental with ID: ${id}`);
    await prisma.rental.delete({
      where: { id },
    });
    console.log("Rental deleted successfully.");
  }
}
