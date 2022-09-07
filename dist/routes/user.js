"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const user_1 = require("../controllers/user");
exports.router.put('/signup', user_1.signup);
exports.router.get('/verify', user_1.verify);
exports.router.post('/login', user_1.login);
exports.router.patch('/forgotpassword', user_1.forgotPassword);
exports.router.patch('/resetpassword', user_1.resetPassword);
exports.default = exports.router;
