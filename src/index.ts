import express from 'express';
import {mongoConnect} from './util/database';
import core from 'express-serve-static-core';

import userRoutes from './routes/user';

const app = express();

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
    app.listen(process.env.PORT || 8080, () => {
        console.log('Server is running!');
    }) 
}) 