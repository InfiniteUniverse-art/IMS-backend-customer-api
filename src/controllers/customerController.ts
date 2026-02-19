import { Request, Response } from 'express';
import * as customerService from '../services/customerService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';



// POST - Register

export const registerCustomer = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (req.file) {
            // We store the relative path so the frontend can append the base URL
            data.profile_image = `/uploads/profiles/${req.file.filename}`;
        }

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        data.policy_id = isNaN(Number(data.policy_id)) ? null : Number(data.policy_id);
        if (data.age) data.age = Number(data.age);
    
        await customerService.createCustomer(data);
        res.status(201).json({ message: "Registration successful" });
    } catch (err: any) {
        // Log full error to help debugging (DB errors, missing tables, etc.)
       logger.error(`Register Error: ${err.message}`);
        if (err.message.includes('ORA-02290')) {
            return res.status(400).json({ error: "Validation failed: Check role or age constraints." });
        }
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

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const customers = await customerService.getAllCustomersFromDb();
        res.status(200).json(customers);
    } catch (error: any) {
        res.status(500).json({ 
            error: "Internal Server Error", 
            message: error.message 
        });
    }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }

        const success = await customerService.softDeleteCustomer(id);

        if (success) {
            res.status(200).json({ message: `Customer with ID ${id} soft-deleted successfully.` });
        } else {
            res.status(404).json({ error: "Customer not found or already deleted." });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }

        const customer = await customerService.getCustomerByIdFromDb(id);

        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }

        res.status(200).json(customer);
    } catch (error: any) {
        logger.error(`GetById Error: ${error?.message || error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// POST - Login
export const loginCustomer = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user: any = await customerService.getCustomerByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const hashed = (user.password || user.PASSWORD) as string;
        const match = await bcrypt.compare(password, hashed || '');
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const payload = {
            id: user.id || user.ID,
            email: user.email || user.EMAIL,
            role: user.role || user.ROLE
        };

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        const userInfo = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            first_name: user.first_name || user.FIRST_NAME,
            last_name: user.last_name || user.LAST_NAME,
            profile_image: user.profile_image || user.PROFILE_IMAGE
        };

        res.json({ token, user: userInfo });
    } catch (err: any) {
        logger.error(`Login Error: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};