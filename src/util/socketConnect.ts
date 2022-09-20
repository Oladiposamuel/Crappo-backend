import { Server } from "socket.io";
import { createServer } from "http";
import { User } from "../models/user";
import * as crypto from 'crypto';

export const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



let userNum;

export const Socket = {
    emit: (event: any, data: any) => {
        console.log(event, data);
        io.sockets.emit(event, data);
    },

    on: (event: any, callback: (data: any) => void) => {
        io.sockets.on(event, callback);
    }
};

io.on("connection", (socket) => {
    console.log("A user connected");

    userNum = crypto.randomBytes(3).toString('hex');

    console.log(userNum);

    let user = 'User' + userNum;
    let socketId;


    socket.on('sendMessage', (data) => {
        console.log(data); 
        //console.log('socket id from backend: ' + socket.id);
        socketId = socket.id;

        data= {...data, user, socketId};

        io.emit('message', data); 
    })

});


