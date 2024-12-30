import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { notFoundFilter } from './interface/shared/filters/not-found';  
import userRoutes from './interface/express/user.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

// Middleware pour les routes non trouvées (404)
app.use(notFoundFilter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
