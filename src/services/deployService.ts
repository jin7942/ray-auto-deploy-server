import { loadProjectConfig, createContext, runRayPipeline } from '@jin7942/ray';
import { logger } from '@jin7942/utils';
import path from 'path';
import fs from 'fs/promises';

interface DeployStatus {
    project: string;
    status: 'success' | 'fail';
    startedAt: string;
    endedAt: string;
    durationSec: number;
    message: string;
    logPath: string;
}

/**
 * Run deployment for a given project using RAY.
 * @param projectName - The name of the project to deploy.
 */
export async function runDeploy(projectName: string): Promise<DeployStatus> {
    const startedAt = new Date();

    try {
        const config = await loadProjectConfig(projectName, '/app/ray.config.json');
        await runRayPipeline(config);

        const endedAt = new Date();
        const status: DeployStatus = {
            project: projectName,
            status: 'success',
            startedAt: startedAt.toISOString(),
            endedAt: endedAt.toISOString(),
            durationSec: Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
            message: 'Deployment successful',
            logPath: path.join(config.internal?.logdir || 'logs', `${startedAt.toISOString().slice(0, 10)}.log`),
        };

        await saveStatus(status);
        logger.info(`[${projectName}] Deployment succeeded`);
        return status;
    } catch (err: any) {
        const endedAt = new Date();
        const status: DeployStatus = {
            project: projectName,
            status: 'fail',
            startedAt: startedAt.toISOString(),
            endedAt: endedAt.toISOString(),
            durationSec: Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
            message: err?.message || 'Deployment failed',
            logPath: 'logs/' + `${startedAt.toISOString().slice(0, 10)}.log`,
        };

        await saveStatus(status);
        logger.error(`[${projectName}] Deployment failed: ${err}`);
        return status;
    }
}

/**
 * Save the latest deploy status to a file.
 */
async function saveStatus(status: DeployStatus): Promise<void> {
    const statusFile = path.resolve('deploy-status.json');
    await fs.writeFile(statusFile, JSON.stringify(status, null, 2), 'utf-8');
}
