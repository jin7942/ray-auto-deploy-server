import { Router, Request, Response } from 'express';
import getRawBody from 'raw-body';
import { verifySignature } from '../utils/verifySignature';
import { runDeploy } from '../services/deployService';
import { CONFIG } from '../_config/constatns';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('[WEBHOOK] Incoming request');

        const raw = (await getRawBody(req)).toString('utf-8');
        const signature = req.header('x-hub-signature-256') || '';

        console.log('[WEBHOOK] Raw payload:', raw);
        console.log('[WEBHOOK] Signature:', signature);

        if (!verifySignature(raw, signature, CONFIG.GITHUB_SECRET)) {
            console.warn('[WEBHOOK] Signature verification failed');
            res.status(401).send('Invalid signature');
            return;
        }

        const payload = JSON.parse(raw);
        const projectName = payload.repository?.name;

        console.log('[WEBHOOK] Parsed project name:', projectName);

        if (!projectName) {
            console.error('[WEBHOOK] Missing repository name');
            res.status(400).send('Missing repository name');
            return;
        }

        console.log('[WEBHOOK] Triggering deployment for:', projectName);
        const result = await runDeploy(projectName);

        console.log('[WEBHOOK] Deployment result:', result);
        res.status(200).json(result);
    } catch (err: any) {
        console.error('[WEBHOOK] Exception:', err);
        if (!res.headersSent) {
            res.status(500).send('Deployment failed');
        }
    }
});

export default router;
