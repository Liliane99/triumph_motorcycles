import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { notFoundFilter } from './interface/shared/filters/not-Found.fitler';

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur Express' });
});


app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Ceci est juste un test' });
});

// Middleware pour gérer les routes non trouvées (404)
app.use(notFoundFilter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
