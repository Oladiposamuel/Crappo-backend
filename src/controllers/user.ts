import express from 'express';
import core from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {sign} from 'jsonwebtoken';
import {ObjectId} from 'mongodb';
import * as crypto from 'crypto';

import {User} from '../models/user';

import {BaseError} from '../util/error';

import {createTransport} from 'nodemailer';

let transport = createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6c3ee6256b17ec",
      pass: "70bc488aaac9a7"
    }
})

interface JwtPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}


export const signup: core.RequestHandler = async(req, res, next) => {
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const email: string = req.body.email;
    const password: string = req.body.password;

    try{ 

        const checkUser = await User.findUser(email);

        if(checkUser) {
            const error = new BaseError(400, 'You are signed up! Log in!');
            throw error;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User(firstName, lastName, email, hashPassword);

        const savedUser = await user.save();
        console.log(savedUser); 

        const savedUserDetails = await User.findUser(email);

        const verificationToken = sign({
            userId: savedUserDetails._id,
            email: savedUserDetails.email,
        },
        'userverificationsecretprivatekey',
        {expiresIn: '1h'}
        );

        const url = `http://localhost:8080/verify`;

        transport.sendMail({
            to: email,
            subject: 'Verify Account',
            html: `Click <a href = ${url} >here</a> to verify your email. Link expires in an hour.`
        })

        res.status(201).send({hasError: false, code: 201, message: 'User created!', user: savedUser, verificationToken: verificationToken});
    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const verify: core.RequestHandler = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new BaseError(404, 'Header not found!');
        throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, 'userverificationsecretprivatekey') as JwtPayload;
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new BaseError(401, 'Not authenticated'); 
            throw error;
        }

        const user = await User.findUser(decodedToken.email);

        if (!user) {
            const error = new BaseError(404, 'User not found!');
            throw error;
        }
        
        const id =  new ObjectId(user._id);

        const updatedUser = await User.updateUserVerification(id);

        const updatedSavedUser = await User.findUser(decodedToken.email);

        res.status(201).send({hasError: false, code: 201, message: 'User verified!', updatedSavedUser: updatedSavedUser});

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const login: core.RequestHandler = async(req, res, next) => { 

    const email = req.body.email;
    const password = req.body.password;

    try {
        const savedUser = await User.findUser(email);
        //console.log(savedUser);

        if(!savedUser) { 
            const error = new BaseError(404, 'User not found! sign up!');
            throw error;
        }

        const checkPassword = bcrypt.compareSync(password, savedUser.password); 
        //console.log(checkPassword);
        if(!checkPassword) {
            const error = new BaseError(401,'Wrong password!') 
            throw error;
        }

        
        const token = sign({
            userId: savedUser._id,
            email: savedUser.email,
        },
        'usersecretprivatekey',
        {expiresIn: '10h'}
        );

        res.status(200).send({hasError: false, code: 200, message: 'Logged In!', user: savedUser, token: token});

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const forgotPassword: core.RequestHandler = async(req, res, next) => {
    const email = req.body.email;

    const savedUser = await User.findUser(email);

    if(!savedUser) {
        const error = new BaseError(404, 'User does not exist!');
        throw error;
    }

    console.log(savedUser);

    const id = new ObjectId(savedUser._id);

    let password = crypto.randomBytes(10).toString('hex');
    console.log(password);

    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.updatePassword(id, hashPassword);

    transport.sendMail({
        to: email,
        subject: 'Forgot Password',
        html: `New Password - ${password}`
    })

    res.status(201).send({hasError: false, code: 201, message: 'Password sent to email!', updatedUser: updatedUser});  
}

export const resetPassword: core.RequestHandler = async(req, res, next) => {

    try{
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            const error = new BaseError(404, 'Header not found!');
            throw error;
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, 'usersecretprivatekey') as JwtPayload;
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new BaseError(401, 'Not authenticated'); 
            throw error;
        }

        const id = new ObjectId(decodedToken.userId); 
        const email = decodedToken.email;

        const user = await User.findUser(email);

        if (!user) {
            const error = new BaseError(404, 'User not found!');
            throw error;
        }

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const checkPassword = bcrypt.compareSync(oldPassword, user.password);

        if(!checkPassword) {
            const error = new BaseError(404, 'Wrong old password');
            throw error;
        }

        if (oldPassword === newPassword) {
            const error = new BaseError(400, 'New password can not be the same with old password. Enter new password.');
            throw error;
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.updatePassword(id, hashNewPassword);

        res.status(201).send({hasError: false, code: 201, message: 'Password sent to email!', updatedUser: updatedUser});

    } catch(error) {
        console.log(error);
        next(error);
    }
}