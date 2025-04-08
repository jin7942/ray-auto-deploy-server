import { Router } from 'express';
import getRawBody from 'raw-body';
import { verifySignature } from '../utils/verifySignature';
import { GITHUB_SECRET } from '../_config/env';
import { runDeploy } from '../services/deployService'; // TODO

const router = Router();

router.post('/', async (req, res) => {
    const signature = req.header('x-hub-signature-256') || '';

    const raw = (await getRawBody(req)).toString('utf-8');
    const isValid = verifySignature(raw, signature, GITHUB_SECRET);

    if (!isValid) {
        return res.status(401).send('Invalid signature');
    }

    const payload = JSON.parse(raw);
    const projectName = payload.repository?.name;

    try {
        await runDeployment(projectName); // 내부적으로 ray 호출
        res.status(200).send('Deployment triggered');
    } catch (err) {
        res.status(500).send('Deployment failed');
    }
});

export default router;
