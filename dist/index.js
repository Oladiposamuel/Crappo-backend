"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./util/database");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socketConnect_1 = require("./util/socketConnect");
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
// const allowedOrigins = ['*'];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/', user_1.default);
app.use((error, req, res, next) => {
    const errorMessage = error.message || "Something went wrong";
    const errorStatus = error.statusCode || 500;
    return res.status(errorStatus).json({
        error: errorMessage,
        status: errorStatus,
        stack: error.stack,
        success: false,
    });
});
(0, database_1.mongoConnect)(() => {
    const httpServer = (0, http_1.createServer)(app);
    httpServer.listen(process.env.PORT || 8080, () => {
        //const io = socketConnect.init(httpServer);
        console.log('Server is running!');
        // io.on("connection", (socket) => {
        //     console.log('Client connected!');
        //     // socket.on('sendMessage', (data) => {
        //     //     console.log(data); 
        //     // })
        // });
    });
    socketConnect_1.io.attach(httpServer);
});
