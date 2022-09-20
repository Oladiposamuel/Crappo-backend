import express from 'express';
import core from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import {sign} from 'jsonwebtoken';
import { BaseError } from '../util/error';

interface JwtPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}

export = async (req: core.Request, res: core.Response, next: core.NextFunction) => {

    try {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            const error = new BaseError(404, 'Header not found!');
            throw error;
        }
    
        const token = authHeader.split(' ')[1];
    
        const decodedToken = jwt.verify(token, 'userverificationsecretprivatekey') as JwtPayload;
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new BaseError(401, 'Not authenticated'); 
            throw error;
        }

        req.userId = decodedToken.userId;

    } catch(error) {
        next(error);
    }

    next();
}