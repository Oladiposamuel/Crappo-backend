"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = require("../util/database");
class User {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isVerified = false;
    }
    save() {
        const db = (0, database_1.getDb)();
        return db.collection('user', { validator: {
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
            } }).insertOne(this)
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    static findUser(email) {
        const db = (0, database_1.getDb)();
        return db.collection('user').findOne({ email: email })
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    static updateUserVerification(id) {
        const db = (0, database_1.getDb)();
        return db.collection('user').updateOne({ _id: id }, { $set: { isVerified: true } })
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    static updatePassword(id, hashPassword) {
        const db = (0, database_1.getDb)();
        return db.collection('user').updateOne({ _id: id }, { $set: { password: hashPassword } })
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
exports.User = User;
