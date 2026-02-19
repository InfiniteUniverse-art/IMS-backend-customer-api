import { Request, Response, NextFunction } from 'express';

export const validateCustomerRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, phone, password, age, policy_id } = req.body;
    const errors: string[] = [];
    if (!first_name) errors.push("First name is required.");
    if (!last_name) errors.push("Last name is required.");
    if (!email || !email.includes('@')) errors.push("A valid email is required.");
    if (!phone) errors.push("Phone number is required.");
    if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");

    if (age && (isNaN(Number(age)) || Number(age) < 18)) {
        errors.push("Age must be a number and at least 18.");
    }

    if (policy_id && isNaN(Number(policy_id))) {
        errors.push("Policy ID must be a valid number.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};


export const validateCustomerUpdate = (req: Request, res: Response, next: NextFunction) => {
    const updates = req.body;
    const errors: string[] = [];

    if (updates.email && !updates.email.includes('@')) {
        errors.push("If providing an email, it must be valid.");
    }

    if (updates.age && (isNaN(Number(updates.age)) || Number(updates.age) < 18)) {
        errors.push("Age must be a number and at least 18.");
    }

    if (updates.policy_id && isNaN(Number(updates.policy_id))) {
        errors.push("Policy ID must be a valid number.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};