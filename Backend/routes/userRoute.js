import express from 'express'
import {loginUser, registerUser, adminLogin, logoutUser, logoutAdmin} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)


// User and Admin authentication check
userRouter.get('/check-auth', auth.check)

// Regular user logout
userRouter.post('/logout', logoutUser)

// Admi logout
userRouter.post('/admin/logout', logoutAdmin)


export default userRouter;