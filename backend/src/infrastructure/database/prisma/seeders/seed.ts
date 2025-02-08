import {seedMotorcycles} from './seedMotorcycles';
import {seedUsers} from './seedUsers';
import {seedRentals} from './seedRentals';
import { seedDrivers } from './seedDrivers';

async function main() {
  await seedMotorcycles();
  await seedUsers();
  await seedRentals();
  await seedDrivers()
}

main();
