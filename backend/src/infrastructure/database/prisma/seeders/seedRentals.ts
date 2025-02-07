import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRentals() {
  
  await prisma.rental.deleteMany();

 
  const userIds = ['21563d60-5673-4d8f-9300-0c78858b42ff', 'a2b94d74-2df6-4843-88f3-f84d9ffbf3bd']; 
  const motorcycleIds = ['1474dfa8-0318-4879-80ed-3a3d9cca447a','3cbdd777-46c0-4192-a7f9-67726b6adb6c','dfdff2d4-ad02-4f80-944f-c0b7c61df729']; 

  
  const rentals = [];
  for (let i = 1; i <= 10; i++) {
    const rental = await prisma.rental.create({
      data: {
        reference: `LOC00${i}`,
        rentalDate: new Date(2025-12-17),  
        price: Math.floor(Math.random() * 100) + 50,  
        clientId: userIds[i % userIds.length],  
        motorcycleId: motorcycleIds[i % motorcycleIds.length], 
      },
    });

    rentals.push(rental);
  }

  console.log(`Rental seed data inserted successfully!`);
}

seedRentals()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
