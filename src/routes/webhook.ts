import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    console.log('[Webhook] Payload received:', req.body);
    res.status(200).send('Webhook received');
});

export default router;
