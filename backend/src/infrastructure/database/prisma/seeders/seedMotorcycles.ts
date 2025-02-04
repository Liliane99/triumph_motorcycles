import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function seedMotorcycles() {
  console.log("Seeding motorcycles...");

  await prisma.motorcycle.createMany({
    data: [
      {
        id: uuidv4(),
        brand: "Yamaha",
        model: "R1",
        purchaseDate: new Date("2022-05-20"),
        licensePlate: "ABC-123",
        kilometers: 5000,
        warrantyDate: new Date("2024-05-20"),
        maintenanceInterval: 10000,
      },
      {
        id: uuidv4(),
        brand: "Honda",
        model: "CBR600RR",
        purchaseDate: new Date("2021-08-15"),
        licensePlate: "XYZ-789",
        kilometers: 12000,
        warrantyDate: new Date("2023-08-15"),
        maintenanceInterval: 15000,
      },
      {
        id: uuidv4(),
        brand: "Ducati",
        model: "Panigale V4",
        purchaseDate: new Date("2023-01-10"),
        licensePlate: "DCT-456",
        kilometers: 3000,
        warrantyDate: new Date("2025-01-10"),
        maintenanceInterval: 12000,
      },
      {
        id: uuidv4(),
        brand: "Kawasaki",
        model: "Ninja ZX-10R",
        purchaseDate: new Date("2020-06-25"),
        licensePlate: "KWK-101",
        kilometers: 15000,
        warrantyDate: new Date("2022-06-25"),
        maintenanceInterval: 8000,
      },
      {
        id: uuidv4(),
        brand: "BMW",
        model: "S1000RR",
        purchaseDate: new Date("2019-09-12"),
        licensePlate: "BMW-777",
        kilometers: 18000,
        warrantyDate: new Date("2021-09-12"),
        maintenanceInterval: 10000,
      },
      {
        id: uuidv4(),
        brand: "Suzuki",
        model: "GSX-R1000",
        purchaseDate: new Date("2023-04-05"),
        licensePlate: "SZK-999",
        kilometers: 2500,
        warrantyDate: new Date("2025-04-05"),
        maintenanceInterval: 11000,
      },
      {
        id: uuidv4(),
        brand: "Triumph",
        model: "Daytona 675",
        purchaseDate: new Date("2022-11-20"),
        licensePlate: "TRM-320",
        kilometers: 9000,
        warrantyDate: new Date("2024-11-20"),
        maintenanceInterval: 7000,
      },
      {
        id: uuidv4(),
        brand: "Harley-Davidson",
        model: "Street Glide",
        purchaseDate: new Date("2018-07-15"),
        licensePlate: "HD-500",
        kilometers: 22000,
        warrantyDate: new Date("2020-07-15"),
        maintenanceInterval: 15000,
      },
      {
        id: uuidv4(),
        brand: "Aprilia",
        model: "RSV4",
        purchaseDate: new Date("2021-10-30"),
        licensePlate: "APL-789",
        kilometers: 8000,
        warrantyDate: new Date("2023-10-30"),
        maintenanceInterval: 9000,
      },
      {
        id: uuidv4(),
        brand: "KTM",
        model: "RC 390",
        purchaseDate: new Date("2023-06-01"),
        licensePlate: "KTM-123",
        kilometers: 4000,
        warrantyDate: new Date("2025-06-01"),
        maintenanceInterval: 10000,
      }
    ],
  });

  console.log("Motorcycles seeded successfully!");
}
