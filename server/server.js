import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import {inngest,functions} from './inngest/index.js';
import { serve } from "inngest/express";

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
await connectDB();

app.get('/', (req, res) => {
  res.send('Hello from PingUp server!');
});
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

