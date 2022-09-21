"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const express_validator_1 = require("express-validator");
router.put('/signup', [
    (0, express_validator_1.body)('password').isLength({ min: 3 }).withMessage('Enter password with at least 5 characters')
        .trim(),
], user_1.signup);
//router.get('/verify', verify);
router.post('/login', user_1.login);
router.patch('/forgotpassword', user_1.forgotPassword);
router.patch('/resetpassword', user_1.resetPassword);
exports.default = router;
