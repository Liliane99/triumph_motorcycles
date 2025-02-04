import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import motorcycleRoutes from './routes/motorcyclesRoutes'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', motorcycleRoutes); 

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Express API is running on http://localhost:${PORT}`);
});
