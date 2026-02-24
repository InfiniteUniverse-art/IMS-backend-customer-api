import express from 'express';
import type { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
import path from 'path';

import { initialize } from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Note: When using credentials (cookies), origin CANNOT be '*'
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true 
}));

app.use(cookieParser()); 
app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/v1/customers', customerRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
        process.exit(1);
    }
}

startServer();