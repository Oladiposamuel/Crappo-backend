import express from 'express';
import {mongoConnect} from './util/database';
import core from 'express-serve-static-core';
import cors from 'cors';
import { createServer } from "http";
import { io }  from './util/socketConnect';


import userRoutes from './routes/user';

const app = express();

const corsOptions = {
    origin: 'https://capable-pasca-217f6b.netlify.app',
    credentials: true,
    //optionSuccessStatus: 200,
}

// const allowedOrigins = ['*'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };

app.use(cors(corsOptions));

app.use(express.json());

app.use('/', userRoutes);

app.use((error: any, req: express.Request, res: express.Response ,next: express.NextFunction) => {
    const errorMessage = error.message || "Something went wrong";
    const errorStatus = error.statusCode || 500;
    return res.status(errorStatus).json({
        error: errorMessage,
        status: errorStatus,
        stack: error.stack,
        success: false,
    })
})


mongoConnect(() => {

    const httpServer = createServer(app);


    httpServer.listen(process.env.PORT || 8080, () => {

        //const io = socketConnect.init(httpServer);

        console.log('Server is running!');
        // io.on("connection", (socket) => {
        //     console.log('Client connected!');

        //     // socket.on('sendMessage', (data) => {
        //     //     console.log(data); 
        //     // })
        // });
    }) 

    io.attach(httpServer); 

}) 