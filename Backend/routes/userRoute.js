import express from 'express'
import {loginUser, registerUser, adminLogin, logoutUser} from '../controllers/userController.js';
import {checkAuth} from '../controllers/checkAuthController.js';
import adminCheckAuth from '../middleware/adminCheckAuthController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// Regular user authentication check
userRouter.get('/verify', checkAuth)

// Regular user logout
userRouter.post('/logout', logoutUser)

// Admin verify
userRouter.get('/admin-verify', adminCheckAuth);

// Admi logout
userRouter.post('/admin/logout', logoutUser)


export default userRouter;