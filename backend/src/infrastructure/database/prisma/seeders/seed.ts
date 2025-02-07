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

  const minCount = Math.min(clients.length, motorcycles.length, 10); 

  if (minCount < 10) {
    console.log(`⚠️ Only ${minCount} clients and motorcycles available. Seeding only ${minCount} drivers.`);
  }

  const driversData = [];

  for (let i = 0; i < minCount; i++) {
    driversData.push({
      driver_id: uuidv4(),
      license_number: `LICENSE_${i + 1}`, 
      experience_level: ["Beginner", "Intermediate", "Expert"][i % 3], 
      date_of_birth: new Date(1980 + (i % 20), i % 12, i % 28 + 1), 
      client_id: clients[i].user_id,
      motorcycle_id: motorcycles[i].id,
    });
  }

  await prisma.driver.createMany({ data: driversData });

  console.log(`Successfully seeded ${minCount} drivers!`);
}