import * as mongodb from 'mongodb';
import {getDb} from '../util/database';
import {ObjectId} from 'mongodb';

type databaseUser = {
    _id: ObjectId;
    avatarName: string;
    password: string;
}

export class User {
    avatarName: string;
    password: string;

    constructor(avatarName: string, password: string ) {
        this.avatarName = avatarName;
        this.password = password;
    }

    save() {
        const db = getDb();
        return db.collection( 
        'user', 
        {validator: {
            $jsonSchema: {
                bsonType: "object",
                title: "Avatar Object Validation",
                required: ["avatarName","password"],
                additionalProperties: false,
                properties: {
                    _id: {}, 
                    avatarName: {
                        bsonType: "string",
                        description: " 'avatarName' is required and is a string"
                    },
                    password: {
                        bsonType: "string",
                        description: " 'password' is required and is a string "
                    },
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

    static findUser(avatarName: string) {
        const db = getDb();
        return db.collection('user').findOne({avatarName: avatarName})
        .then((user: databaseUser) => {
            return user;
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }

    static updateUserVerification(id: ObjectId) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: {isVerified: "true"}})
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