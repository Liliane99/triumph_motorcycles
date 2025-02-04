import {seedMotorcycles} from './seedMotorcycles';
import {seedUsers} from './seedUsers';

async function main() {
  await seedMotorcycles();
  await seedUsers();
  
}

main();
