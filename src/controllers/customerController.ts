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