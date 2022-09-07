"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./util/database");
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
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
    app.listen(process.env.PORT || 8080, () => {
        console.log('Server is running!');
    });
});
