import express from 'express';
import rentalController from '../controllers/RentalController';

const router = express.Router();

router.use('/rentals', rentalController); 

export default router;
