import express from 'express';
import driverController from '../controllers/DriverController';

const router = express.Router();

router.use('/drivers', driverController); 

export default router;
