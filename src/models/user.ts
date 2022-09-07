import * as mongodb from 'mongodb';
import {getDb} from '../util/database';
import {ObjectId} from 'mongodb';

type databaseUser = {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
}

export class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;

    constructor(firstName: string, lastName: string, email: string, password: string ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isVerified = false;
    }

    save() {
        const db = getDb();
        return db.collection(
        'user', 
        {validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["firstName", "lastName", "email", "password"],
                additionalProperties: false,
                properties: {
                    _id: {},
                    firstName: {
                        bsonType: "string",
                        description: " 'firstName' is required and is a string"
                    },
                    lastName: {
                        bsonType: "string",
                        description: " 'lastName' is required and is a string "
                    },
                    email: {
                        bsonType: "string",
                        description: " 'email' is required and is a string "
                    },
                    password: {
                        bsonType: "string",
                        description: " 'password' is required and is a string "
                    },
                    isVerified: {
                        bsonType: "boolean",
                        description: " 'isVerified is not required. It is a boolean "
                    }
                }
            }
        }}).insertOne(this)
        .then((user: databaseUser) => {
            return user;
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }

    static findUser(email: string) {
        const db = getDb();
        return db.collection('user').findOne({email: email})
        .then((user: databaseUser) => {
            return user;
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }

    static updateUserVerification(id: ObjectId) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: {isVerified: true}})
        .then((user: databaseUser) => { 
            return user;
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }

    static updatePassword(id: ObjectId, hashPassword: string) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: {password: hashPassword}})
        .then((user: databaseUser) => {
            return user;
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }
}