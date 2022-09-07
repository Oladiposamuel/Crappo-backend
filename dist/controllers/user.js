"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.verify = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const jsonwebtoken_1 = require("jsonwebtoken");
const mongodb_1 = require("mongodb");
const crypto = __importStar(require("crypto"));
const user_1 = require("../models/user");
const error_1 = require("../util/error");
const nodemailer_1 = require("nodemailer");
let transport = (0, nodemailer_1.createTransport)({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6c3ee6256b17ec",
        pass: "70bc488aaac9a7"
    }
});
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const checkUser = yield user_1.User.findUser(email);
        if (checkUser) {
            const error = new error_1.BaseError(400, 'You are signed up! Log in!');
            throw error;
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.User(firstName, lastName, email, hashPassword);
        const savedUser = yield user.save();
        console.log(savedUser);
        const savedUserDetails = yield user_1.User.findUser(email);
        const verificationToken = (0, jsonwebtoken_1.sign)({
            userId: savedUserDetails._id,
            email: savedUserDetails.email,
        }, 'userverificationsecretprivatekey', { expiresIn: '1h' });
        const url = `http://localhost:8080/verify`;
        transport.sendMail({
            to: email,
            subject: 'Verify Account',
            html: `Click <a href = ${url} >here</a> to verify your email. Link expires in an hour.`
        });
        res.status(201).send({ hasError: false, code: 201, message: 'User created!', user: savedUser, verificationToken: verificationToken });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.signup = signup;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new error_1.BaseError(404, 'Header not found!');
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'userverificationsecretprivatekey');
        console.log(decodedToken);
        if (!decodedToken) {
            const error = new error_1.BaseError(401, 'Not authenticated');
            throw error;
        }
        const user = yield user_1.User.findUser(decodedToken.email);
        if (!user) {
            const error = new error_1.BaseError(404, 'User not found!');
            throw error;
        }
        const id = new mongodb_1.ObjectId(user._id);
        const updatedUser = yield user_1.User.updateUserVerification(id);
        const updatedSavedUser = yield user_1.User.findUser(decodedToken.email);
        res.status(201).send({ hasError: false, code: 201, message: 'User verified!', updatedSavedUser: updatedSavedUser });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.verify = verify;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const savedUser = yield user_1.User.findUser(email);
        //console.log(savedUser);
        if (!savedUser) {
            const error = new error_1.BaseError(404, 'User not found! sign up!');
            throw error;
        }
        const checkPassword = bcrypt_1.default.compareSync(password, savedUser.password);
        //console.log(checkPassword);
        if (!checkPassword) {
            const error = new error_1.BaseError(401, 'Wrong password!');
            throw error;
        }
        const token = (0, jsonwebtoken_1.sign)({
            userId: savedUser._id,
            email: savedUser.email,
        }, 'usersecretprivatekey', { expiresIn: '10h' });
        res.status(200).send({ hasError: false, code: 200, message: 'Logged In!', user: savedUser, token: token });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.login = login;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const savedUser = yield user_1.User.findUser(email);
    if (!savedUser) {
        const error = new error_1.BaseError(404, 'User does not exist!');
        throw error;
    }
    console.log(savedUser);
    const id = new mongodb_1.ObjectId(savedUser._id);
    let password = crypto.randomBytes(10).toString('hex');
    console.log(password);
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const updatedUser = yield user_1.User.updatePassword(id, hashPassword);
    transport.sendMail({
        to: email,
        subject: 'Forgot Password',
        html: `New Password - ${password}`
    });
    res.status(201).send({ hasError: false, code: 201, message: 'Password sent to email!', updatedUser: updatedUser });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new error_1.BaseError(404, 'Header not found!');
            throw error;
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, 'usersecretprivatekey');
        console.log(decodedToken);
        if (!decodedToken) {
            const error = new error_1.BaseError(401, 'Not authenticated');
            throw error;
        }
        const id = new mongodb_1.ObjectId(decodedToken.userId);
        const email = decodedToken.email;
        const user = yield user_1.User.findUser(email);
        if (!user) {
            const error = new error_1.BaseError(404, 'User not found!');
            throw error;
        }
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const checkPassword = bcrypt_1.default.compareSync(oldPassword, user.password);
        if (!checkPassword) {
            const error = new error_1.BaseError(404, 'Wrong old password');
            throw error;
        }
        if (oldPassword === newPassword) {
            const error = new error_1.BaseError(400, 'New password can not be the same with old password. Enter new password.');
            throw error;
        }
        const hashNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const updatedUser = yield user_1.User.updatePassword(id, hashNewPassword);
        res.status(201).send({ hasError: false, code: 201, message: 'Password sent to email!', updatedUser: updatedUser });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.resetPassword = resetPassword;
