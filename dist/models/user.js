"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = require("../util/database");
class User {
    constructor(avatarName, password) {
        this.avatarName = avatarName;
        this.password = password;
    }
    save() {
        const db = (0, database_1.getDb)();
        return db.collection('user', { validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Avatar Object Validation",
                    required: ["avatarName", "password"],
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
            } }).insertOne(this)
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    static findUser(avatarName) {
        const db = (0, database_1.getDb)();
        return db.collection('user').findOne({ avatarName: avatarName })
            .then((user) => {
            return user;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    static updateUserVerification(id) {
        const db = (0, database_1.getDb)();
        return db.collection('user').updateOne({ _id: id }, { $set: { isVerified: "true" } })
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
