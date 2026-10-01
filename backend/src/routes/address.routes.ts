import { Router } from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// All address routes require login
router.use(verifyToken);

router.get('/', AddressController.getMyAddresses);
router.post('/', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);
router.patch('/:id/default', AddressController.setDefaultAddress);

export default router;
