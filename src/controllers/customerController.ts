import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';

export const registerTestUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        
        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }

        const result = await customerService.createTestUser(name);
        res.status(201).json({ 
            message: "User created in Oracle!",
            data: result 
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};