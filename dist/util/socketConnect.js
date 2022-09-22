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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const user_1 = require("../models/user");
const crypto = __importStar(require("crypto"));
exports.io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let userNum;
exports.Socket = {
    emit: (event, data) => {
        console.log(event, data);
        exports.io.sockets.emit(event, data);
    },
    on: (event, callback) => {
        exports.io.sockets.on(event, callback);
    }
};
exports.io.on("connection", (socket) => {
    console.log("A user connected");
    userNum = crypto.randomBytes(3).toString('hex');
    console.log(userNum);
    let user = 'User' + userNum;
    let socketId;
    let avatarName;
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        socketId = socket.id;
        avatarName = data.avatarName;
        if (avatarName !== null) {
            const avatarDetails = yield user_1.User.findUser(avatarName);
            //console.log(avatarDetails); 
            const verifiedAvatarName = avatarDetails.avatarName;
            if (verifiedAvatarName) {
                user = verifiedAvatarName;
            }
        }
        data = Object.assign(Object.assign({}, data), { user, socketId });
        exports.io.emit('message', data);
    }));
});
