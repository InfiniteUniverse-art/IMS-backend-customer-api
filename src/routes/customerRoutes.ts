import { Router } from 'express';
import { registerCustomer, updateProfile  } from '../controllers/customerController.js';
import { validateCustomerRegistration, validateCustomerUpdate } from '../middleware/validateCustomer.js';
import { upload } from '../middleware/upload.js';
const router = Router();


router.post('/create', upload.single('image'), validateCustomerRegistration, registerCustomer);
router.patch('/customers/:id',validateCustomerUpdate, updateProfile);
router.get('/test', (req, res) => res.send("Route is working!"));


export default router;