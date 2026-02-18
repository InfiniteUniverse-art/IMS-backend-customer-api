import express from 'express';
import type { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// --- Routes ---

// Root welcome
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Customer API (TypeScript + Oracle)');
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});