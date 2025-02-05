import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRentals() {
  
  await prisma.rental.deleteMany();

 
  const userIds = ['080ba355-5373-407f-95b1-a2bf32ca6440', '1e6e40b2-8e8e-49d3-b10a-217114f9062d']; 
  const motorcycleIds = ['386fe27b-c018-4190-bbbb-a71d59b1d391','14977e15-d7b1-4cb4-8efd-1e7c3ad2b1c6','9cf874b5-e427-4f2e-a5da-7d44c1e0a0e5']; 

  
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
