import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; 

const prisma = new PrismaClient();

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("Admin123", 10);

  const adminId = uuidv4();
  const managerId = uuidv4();

 
  await prisma.user.createMany({
    data: [
      {
        user_id: adminId, 
        user_name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        phone_number: "+33612345678",
        created_by: adminId, 
        updated_by: adminId, 
      },
      {
        user_id: managerId, 
        user_name: "Manager1",
        email: "manager@example.com",
        password: hashedPassword,
        role: "manager",
        phone_number: "+33612345678",
        created_by: adminId, 
        updated_by: adminId, 
      }
    ],
  });

  console.log("User seed data inserted successfully!");
}


