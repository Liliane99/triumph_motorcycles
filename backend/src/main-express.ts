import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './interface/express/user.routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Express server running on http://localhost:3000');
});
