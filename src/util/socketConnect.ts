import { Server } from "socket.io";
import { createServer } from "http";
import { User } from "../models/user";
import * as crypto from 'crypto';

export const io = new Server({
    cors: {
        origin: "https://velvety-cobbler-00314f.netlify.app",
        methods: ["GET", "POST"],
        credentials: true,
    },
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
    let avatarName;


    socket.on('sendMessage', async (data) => {
        console.log(data); 
        
        socketId = socket.id;

        avatarName = data.avatarName;

        if(avatarName !== null) {
            const avatarDetails = await User.findUser(avatarName);
            //console.log(avatarDetails); 
            const verifiedAvatarName = avatarDetails.avatarName;
    
            if(verifiedAvatarName) {
                user = verifiedAvatarName
            }
        }

        data= {...data, user, socketId};

        io.emit('message', data); 
    })

});


