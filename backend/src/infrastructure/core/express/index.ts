import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
//import motorcycleRoutes from "./routes/motorcyclesRoutes";
//import trialsRoutes from "./routes/trialsRoutes";
//import warrantiesRoutes from "./routes/warrantiesRoutes";
//import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());             
app.use(helmet());                         
app.use(express.json());         

// app.use("/api/motorcycles", motorcycleRoutes);
// app.use("/api/trials", trialsRoutes);
// app.use("/api/warranties", warrantiesRoutes);

//app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Express API is running on http://localhost:${PORT}`);
});
