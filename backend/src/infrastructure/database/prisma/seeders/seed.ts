import {seedMotorcycles} from './seedMotorcycles';
import {seedUsers} from './seedUsers';
import {seedRentals} from './seedRentals';

async function main() {
  await seedMotorcycles();
  await seedUsers();
  await seedRentals();
  
}

main();
