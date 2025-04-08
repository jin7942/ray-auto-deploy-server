import crypto from 'crypto';

/**
 * Verifies the GitHub webhook signature.
 * @param payload Raw request body as string
 * @param signature X-Hub-Signature-256 header
 * @param secret Webhook secret
 * @returns true if valid
 */
export function verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    } catch {
        return false;
    }
}
