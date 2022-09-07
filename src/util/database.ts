import * as mongoDB from 'mongodb';
import {MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';

let _db: any;

export const mongoConnect = async(callback: any) => {

    dotenv.config();

    MongoClient.connect("mongodb+srv://Olasammie:h1PBmlHFfZaJ1hGW@crappo-app.o6v3kqa.mongodb.net/crappo")
    .then(client => {
        console.log('Connected to MongoDB');
        _db = client.db();
        callback();
    })
    .catch(error => {
        console.log(error);
        throw error;
    })
}

export const getDb = () => {
    if(_db) {
        return _db;
    } else {
        throw 'Database not found';
    }
}