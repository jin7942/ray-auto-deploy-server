import { Router, Request, Response } from 'express';
import getRawBody from 'raw-body';
import { verifySignature } from '../utils/verifySignature';
import { runDeploy } from '../services/deployService';
import { CONFIG } from '../_config/constatns';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const raw = (await getRawBody(req)).toString('utf-8');
        const signature = req.header('x-hub-signature-256') || '';

        if (!verifySignature(raw, signature, CONFIG.GITHUB_SECRET)) {
            res.status(401).send('Invalid signature');
            return;
        }

        const payload = JSON.parse(raw);
        const projectName = payload.repository?.name;

        if (!projectName) {
            res.status(400).send('Missing repository name');
            return;
        }

        const result = await runDeploy(projectName);

        res.status(200).json(result);
    } catch (err: any) {
        if (!res.headersSent) {
            res.status(500).send('Deployment failed');
        }
    }
});

export default router;
