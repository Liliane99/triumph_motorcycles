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
      {
        driver_id: uuidv4(),
        license_number: "112233445",
        experience_level: "Expert",
        date_of_birth: new Date("1980-03-10"),
        client_id: clients[2].user_id,
        motorcycle_id: motorcycles[2].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "556677889",
        experience_level: "Beginner",
        date_of_birth: new Date("1995-07-25"),
        client_id: clients[3].user_id,
        motorcycle_id: motorcycles[3].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "998877665",
        experience_level: "Expert",
        date_of_birth: new Date("1982-12-30"),
        client_id: clients[4].user_id,
        motorcycle_id: motorcycles[4].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "667788990",
        experience_level: "Intermediate",
        date_of_birth: new Date("1992-01-05"),
        client_id: clients[5].user_id,
        motorcycle_id: motorcycles[5].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "223344556",
        experience_level: "Expert",
        date_of_birth: new Date("1988-06-18"),
        client_id: clients[6].user_id,
        motorcycle_id: motorcycles[6].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "443322110",
        experience_level: "Beginner",
        date_of_birth: new Date("2000-03-12"),
        client_id: clients[7].user_id,
        motorcycle_id: motorcycles[7].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "778899112",
        experience_level: "Intermediate",
        date_of_birth: new Date("1993-09-25"),
        client_id: clients[8].user_id,
        motorcycle_id: motorcycles[8].id,
      },
      {
        driver_id: uuidv4(),
        license_number: "334455667",
        experience_level: "Expert",
        date_of_birth: new Date("1986-04-14"),
        client_id: clients[9].user_id,
        motorcycle_id: motorcycles[9].id,
      }
    ],
  });

  console.log("Drivers seeded successfully!");
}
