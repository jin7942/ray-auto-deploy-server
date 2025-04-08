import app from './app';
import { PORT } from './_config/env';

app.listen(PORT, () => {
    console.log(`[RAY-SERVER] Listening on port ${PORT}`);
});
