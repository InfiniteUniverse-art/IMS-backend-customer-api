import express from 'express';
import type { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initialize } from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// --- Register Routes ---
// This mounts all routes from customerRoutes under the /api prefix
app.use('/api/customers', customerRoutes);
// app.use('/customers', customerRoutes);

// Root welcome
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Customer API (TypeScript + Oracle)');
});

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

// --- Server Startup Logic ---

async function startServer() {
    try {
        console.log('⏳ Connecting to Oracle Database...');
        await initialize();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Critical Error: Could not start server.');
        console.error(err);
        process.exit(1); // Stop the process if the DB fails
    }
}

startServer();