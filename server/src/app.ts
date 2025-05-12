import express from 'express';
import cors from 'cors';

import registeredUserRoutes from './routes/registered-user-routes';
import blogPostRouter from './routes/blog-post-routes';
import followRouter from './routes/follow-routes';
import commentRouter from './routes/comment-routes';
import countryRouter from './routes/country-route';
import likeRouter from './routes/like-routes';
import dotenv from 'dotenv';
import authRouter from './routes/auth-route';

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());          // critical for req.body to work
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', registeredUserRoutes);
app.use('/api/blog-post', blogPostRouter);
app.use('/api/follow', followRouter);
app.use('/api/like', likeRouter);
app.use('/api/comment', commentRouter);
app.use('/api/country', countryRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('API is running');
});

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;