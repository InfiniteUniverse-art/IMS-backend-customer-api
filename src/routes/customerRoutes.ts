import { Router } from 'express';
import { registerCustomer, updateProfile, getAllCustomers, deleteCustomer, getCustomerById, loginCustomer } from '../controllers/customerController.js';
import { validateCustomerRegistration, validateCustomerUpdate } from '../middleware/validateCustomer.js';
import { upload } from '../middleware/upload.js';
const router = Router();

//test route to check if the route is working
router.get('/test', (req, res) => res.send("Route is working!"));

// Login route
router.post('/create', upload.single('image'), validateCustomerRegistration, registerCustomer);
router.post('/login', loginCustomer);

// Customer registration route with image upload and validation
// Get all customers, delete a customer, and update a customer's profile
router.get('/', getAllCustomers);
// router.get('/:id', getCustomerById);
router.delete('/:id', deleteCustomer);
router.patch('/update/:id', validateCustomerUpdate, updateProfile);


export default router;