import { Router } from 'express';
import { registerCustomer, updateProfile, getAllCustomers, deleteCustomer, getCustomerById } from '../controllers/customerController.js';
import { validateCustomerRegistration, validateCustomerUpdate } from '../middleware/validateCustomer.js';
import { upload } from '../middleware/upload.js';
const router = Router();

//test route to check if the route is working
router.get('/test', (req, res) => res.send("Route is working!"));

// Customer registration route with image upload and validation
router.post('/create', upload.single('image'), validateCustomerRegistration, registerCustomer);
// Get all customers, delete a customer, and update a customer's profile
router.get('/', getAllCustomers);
// router.get('/:id', getCustomerById);
router.delete('/:id', deleteCustomer);
router.patch('/update/:id', validateCustomerUpdate, updateProfile);


export default router;