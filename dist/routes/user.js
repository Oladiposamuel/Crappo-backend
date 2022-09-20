"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
router.put('/signup', user_1.signup);
router.get('/verify', user_1.verify);
router.post('/login', user_1.login);
router.patch('/forgotpassword', user_1.forgotPassword);
router.patch('/resetpassword', user_1.resetPassword);
router.get('/chat', user_1.chat);
exports.default = router;
