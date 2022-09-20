
import express  from 'express';

const router = express.Router();

import { forgotPassword, login, verify, signup, resetPassword, chat } from '../controllers/user';

import isAuthUser from '../middlewares/isAuthUser';

router.put('/signup', signup);

router.get('/verify', verify);

router.post('/login', login);

router.patch('/forgotpassword', forgotPassword);

router.patch('/resetpassword', resetPassword);

router.get('/chat', chat);

export default router;