import express from 'express';
import motorcycleController from '../controllers/MotorcycleController';

const router = express.Router();

router.use('/motorcycles', motorcycleController); 

export default router;
