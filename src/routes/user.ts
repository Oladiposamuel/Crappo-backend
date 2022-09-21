
import express  from 'express';

const router = express.Router();

import { forgotPassword, login, signup, resetPassword, test} from '../controllers/user';

import {check, body} from 'express-validator';

import isAuthUser from '../middlewares/isAuthUser';

router.put(
    '/signup',
    [
        body('password').isLength({min: 3}).withMessage('Enter password with at least 5 characters')
            .trim(),
    ],
    signup);

//router.get('/verify', verify);

router.post('/login', login);

router.patch('/forgotpassword', forgotPassword);

router.patch('/resetpassword', resetPassword);

router.get('/test', test)


export default router;