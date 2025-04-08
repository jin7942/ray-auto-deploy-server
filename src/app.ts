import express from 'express';
import webhookRouter from './routes/webhook';

const app = express();
app.use(express.json());
app.use('/webhook', webhookRouter);

export default app;
