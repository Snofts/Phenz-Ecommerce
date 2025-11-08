import express from 'express'
import {loginUser, registerUser, adminLogin, logoutUser, logoutAdmin} from '../controllers/userController.js';
import {userCheckAuth} from '../middleware/userAuth.js';
import adminCheckAuth from '../middleware/adminCheckAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)


// Regular user authentication check
userRouter.get('/verify', userCheckAuth)

// Regular user logout
userRouter.post('/logout', logoutUser)

// Admin verify
userRouter.get('/admin-verify', adminCheckAuth);

// Admi logout
userRouter.post('/admin/logout', logoutAdmin)


export default userRouter;