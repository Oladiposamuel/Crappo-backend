
import express  from 'express';

export const router = express.Router();

import { forgotPassword, login, verify, signup, resetPassword } from '../controllers/user';

router.put('/signup', signup);

router.get('/verify', verify);

router.post('/login', login);

router.patch('/forgotpassword', forgotPassword);

router.patch('/resetpassword', resetPassword);

export default router;