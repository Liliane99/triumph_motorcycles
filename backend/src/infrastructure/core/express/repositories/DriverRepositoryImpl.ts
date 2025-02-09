import { DriverRepository } from "../../../../application/ports/repositories/DriverRepository";
import { Driver } from "../../../../domain/entities/Driver";
import { PrismaClient } from "@prisma/client";
import { User } from "../../../../domain/entities/User";
import { Motorcycle } from "../../../../domain/entities/Motorcycle";
import { LicenseNumber } from "../../../../domain/values/users/LicenseNumber";
import { DateOfBirth } from "../../../../domain/values/Driver/DateOfBirth";

const prisma = new PrismaClient();

export class DriverRepositoryImpl implements DriverRepository {

  private mapToDriver(prismaDriver: any): Driver {
    if (!prismaDriver) {
      throw new Error("Invalid prismaDriver: object is undefined or null");
    }
    
    const client = prismaDriver.client
      ? new User(
          prismaDriver.client.user_id, 
          prismaDriver.client.user_name,
          prismaDriver.client.email,
          prismaDriver.client.password,
          prismaDriver.client.role,
          prismaDriver.client.phone_number,
          prismaDriver.client.created_by,
          prismaDriver.client.updated_by,
          prismaDriver.client.created_at,
          prismaDriver.client.updated_at
        )
      : null;
  
    const motorcycle = prismaDriver.motorcycle
      ? new Motorcycle(
        prismaDriver.motorcycle.id,
        prismaDriver.motorcycle.brand,
        prismaDriver.motorcycle.model,
        prismaDriver.motorcycle.purchaseDate,
        prismaDriver.motorcycle.licensePlate,
        prismaDriver.motorcycle.kilometers,
        prismaDriver.motorcycle.warrantyDate,
        prismaDriver.motorcycle.maintenanceInterval,
        prismaDriver.motorcycle.ownerId,
        prismaDriver.motorcycle.createdAt,
        prismaDriver.motorcycle.updatedAt,
      )
      : null;
      
    return new Driver(
      prismaDriver.driver_id, 
      LicenseNumber.from(prismaDriver.license_number) as LicenseNumber,
      prismaDriver.experience_level,
      DateOfBirth.from(prismaDriver.date_of_birth) as DateOfBirth,
      client!,
      motorcycle!
    );
  }

  async save(driver: Driver): Promise<Driver> {
    console.log("Attempting to save driver:", driver);

    const dateOfBirthParsed = driver.dateOfBirth.value.toISOString();
    const licenseNumberParsed = driver.licenseNumber.value;

    if (isNaN(new Date(dateOfBirthParsed).getTime())) {
      throw new Error(`Invalid dateOfBirth value: ${driver.dateOfBirth}`);
    }

    const clientId = driver.clientId;
    const motorcycleId = driver.motorcycleId;

    console.log("➡️ Driver License Number:", licenseNumberParsed);
    console.log("➡️ Date of Birth (Parsed):", dateOfBirthParsed);
    console.log("➡️ Experience Level:", driver.experienceLevel);
    console.log("➡️ Client ID:", clientId);
    console.log("➡️ Motorcycle ID:", motorcycleId);

    const existingDriver = await prisma.driver.findUnique({
      where: { driver_id: driver.driverId },
    });

    if (existingDriver) {
      console.log("Existing driver found, updating...");
      const updatedDriver = await prisma.driver.update({
        where: { driver_id: driver.driverId },
        data: {
          license_number: licenseNumberParsed,
          date_of_birth: dateOfBirthParsed,
          experience_level: driver.experienceLevel,
          client_id: clientId,
          motorcycle_id: motorcycleId,
          updated_at: new Date(),
        },
        include: {
          client: true,
          motorcycle: true,
        },
      });

      return this.mapToDriver(updatedDriver);
    }

    console.log("No existing driver found, creating new...");
    const newDriver = await prisma.driver.create({
      data: {
        license_number: licenseNumberParsed,
        date_of_birth: dateOfBirthParsed,
        experience_level: driver.experienceLevel,
        client_id: clientId,
        motorcycle_id: motorcycleId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        client: true,
        motorcycle: true,
      },
    });

    return this.mapToDriver(newDriver);
  }

  async findById(id: string): Promise<Driver | null> {
    try {
      console.log(`Looking for driver with ID: ${id}`);
      const prismaDriver = await prisma.driver.findUnique({
        where: { driver_id: id },
        include: {
          client: true,
          motorcycle: true,
        },
      });

      if (!prismaDriver) {
        console.log("Driver not found.");
        return null;
      }

      console.log("Driver found:", prismaDriver);
      return this.mapToDriver(prismaDriver);
    } catch (error) {
      console.error("Error finding driver:", error);
      return null;
    }
  }

  async getAll(): Promise<Driver[]> {
    console.log("Fetching all drivers...");
    const prismaDrivers = await prisma.driver.findMany({
      include: {
        client: true,
        motorcycle: true,
      },
    });

    console.log(`Found ${prismaDrivers.length} drivers.`);
    return prismaDrivers.map(this.mapToDriver);
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`Attempting to delete driver with ID: ${id}`);
      await prisma.driver.delete({
        where: { driver_id: id },
      });
      console.log("Driver deleted successfully.");
    } catch (error) {
      console.error(`Error deleting driver with ID ${id}:`, error);
    }
  }
}
