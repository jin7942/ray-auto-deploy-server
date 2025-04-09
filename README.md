# RAY-AUTO-DEPLOY-SERVER

`RAY-AUTO-DEPLOY-SERVER` is a lightweight Node.js server that receives GitHub Webhook events and triggers automatic deployment using [RAY](https://github.com/jin7942/ray).

[한국어 README 보기](./README.ko.md)

## Features

-   **GitHub Webhook Integration**
    -   Automatically triggers deployment on push events
-   **RAY Integration**
    -   Clones, builds, and deploys via Docker based on configured project info
-   **Deployment Logging**
    -   Saves deployment results in JSON format
    -   Uses `@jin7942/utils` for logging utilities
-   **Simple Express Architecture**
    -   Easy to understand, extend, and operate
-   **Proxy and Domain Friendly**
    -   Works behind reverse proxies like Nginx

---

## Directory Structure

```bash
src/
├── routes/
│   └── webhook.ts          # GitHub Webhook handling and signature verification
├── services/
│   └── deployService.ts    # runDeploy() - executes RAY and logs status
├── utils/
│   └── verifySignature.ts  # Signature validation
├── _config/
│   └── constants.ts        # Environment config and constants
└── server.ts               # Express entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up `.env` file (for local/dev use)

```env
PORT=7979
GITHUB_SECRET=your_github_webhook_secret
```

### 3. Start the server

```bash
npm run dev
# or
npm start
```

---

## GitHub Webhook Setup

1. Go to `Settings > Webhooks` on your GitHub repository
2. Payload URL: `https://YOUR_DOMAIN/webhook`
3. Content type: `application/json`
4. Secret: Must match the `.env` GITHUB_SECRET
5. Event type: `Just the push event`
6. Save

---

## Tech Stack

-   Node.js (Express)
-   TypeScript
-   raw-body (to get raw payload)
-   RAY deployment library ([github.com/jin7942/ray](https://github.com/jin7942/ray))

---

## Example Output (deploy-status.json)

```json
{
    "project": "ray",
    "status": "success",
    "startedAt": "2025-04-09T07:25:00.000Z",
    "endedAt": "2025-04-09T07:25:10.000Z",
    "durationSec": 10,
    "message": "Deployment successful",
    "logPath": "logs/2025-04-09.log"
}
```

---

## Contribution

This project is open source.  
Feel free to fork, modify, or contribute via PR. Feedback is always welcome.

---

## License

MIT License
