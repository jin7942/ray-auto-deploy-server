// server.ts
import express from 'express';
import webhookRouter from './routes/webhook';
import { CONFIG } from './_config/constatns';

const app = express();

app.use('/webhook', webhookRouter);

app.listen(CONFIG.PORT, () => {
    console.log(`Auto Deploy Server running at ${CONFIG.BASE_URL}`);
});
