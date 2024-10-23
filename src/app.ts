import express from "express";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionRoutes";
import adminRoutes from "./routes/adminRoutes";
import { startScheduler } from "./scheduler/scheduler";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", questionRoutes);
app.use("/api", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start the scheduler after the server is up
  startScheduler();
});
