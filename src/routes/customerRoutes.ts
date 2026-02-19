import { Router } from 'express';
import { registerCustomer, updateProfile  } from '../controllers/customerController.js';
import { validateCustomerRegistration, validateCustomerUpdate } from '../middleware/validateCustomer.js';
const router = Router();

router.post('/create', validateCustomerRegistration, registerCustomer);
router.get('/test', (req, res) => res.send("Route is working!"));
router.patch('/customers/:id',validateCustomerUpdate, updateProfile);


export default router;