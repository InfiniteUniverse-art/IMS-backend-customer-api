import { Router } from 'express';
import { registerTestUser } from '../controllers/customerController.js';

const router = Router();

// Map POST /api/customers to the controller function
router.post('/customers', registerTestUser);
router.get('/test', (req, res) => res.send("Route is working!"));

export default router;