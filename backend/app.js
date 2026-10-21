import express from 'express';
import cors from 'cors';

import {userRoutes} from './routes/userRouter.js'
import {forumRoutes} from './routes/forumRouter.js'

export const app = express();

app.use(cors()); 
app.use(express.json());  


app.get('/api', (req, res) => {
  res.json({ status: 'API online' });
});

app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);

export default app;

