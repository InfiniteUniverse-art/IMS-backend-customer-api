import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';



// POST - Register

export const registerCustomer = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // req.file is populated by the 'upload' middleware
        if (req.file) {
            // We store the relative path so the frontend can append the base URL
            data.profile_image = `/uploads/profiles/${req.file.filename}`;
        }

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        data.policy_id = Number(data.policy_id); 
        await customerService.createCustomer(data);
        
        res.status(201).json({ message: "Registration successful" });
    } catch (err: any) {
        if (err.message.includes('ORA-00001')) {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Database error occurred" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const updates = req.body;

        delete updates.password;
        delete updates.email;
        delete updates.id;

        const result = await customerService.updateCustomer(id, updates);

        if (result?.rowsAffected === 0) {
            return res.status(404).json({ error: "Customer not found or no changes made" });
        }

        res.json({ message: "Profile updated successfully" });
    } catch (err: any) {
        logger.error(`Update Error: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};