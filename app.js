import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import purchaseRouter from './routes/purchaseItem.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/purchase-item", purchaseRouter);

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDatabase();
});

