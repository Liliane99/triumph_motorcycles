import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function seedDrivers() {
  console.log("Seeding drivers...");

  const clients = await prisma.user.findMany();
  const motorcycles = await prisma.motorcycle.findMany();

  if (clients.length === 0 || motorcycles.length === 0) {
    console.log("No clients or motorcycles found. Please seed the users and motorcycles first.");
    return;
  }

  await prisma.driver.createMany({
    data: [
      {
        driver_id: uuidv4(),
        license_number: "123456789",
        experience_level: "Beginner",
        date_of_birth: new Date("1990-05-15"),
        client_id: clients[0].user_id,
        motorcycle_id: motorcycles[0].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "987654321",
        experience_level: "Intermediate",
        date_of_birth: new Date("1985-10-20"),
        client_id: clients[1].user_id,
        motorcycle_id: motorcycles[1].id,
      },
    ],
  });

  console.log("Drivers seeded successfully!");
}
