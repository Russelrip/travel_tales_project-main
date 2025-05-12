import { Router } from 'express';
import * as registeredUserController from '../controllers/registered-user-controller';
import { authenticate } from '../middleware/auth-middleware';

const registeredUserRouter = Router();

registeredUserRouter.post('/register', registeredUserController.registerUser); // No need to authenticate
registeredUserRouter.post('/login', registeredUserController.loginUser);
registeredUserRouter.get('/profile/:userId', authenticate, registeredUserController.getUserProfile);
registeredUserRouter.get('/:id', authenticate, registeredUserController.getUserById);
registeredUserRouter.get('/', authenticate, registeredUserController.getAllUsers);
registeredUserRouter.put('/:id', authenticate, registeredUserController.updateUser);
registeredUserRouter.delete('/:id', authenticate, registeredUserController.deleteUser);
registeredUserRouter.get("/by-username/:username", authenticate, registeredUserController.getUserByUsername);

export default registeredUserRouter;