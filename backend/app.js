import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRouter.js'
import forumRouter from './routes/forumRouter.js'

export const app = express();

app.use(cors()); 
app.use(express.json());  


app.get('/api', (req, res) => {
  res.json({ status: 'API online' });
});

app.use('/api/users', userRouter);
app.use('/api/forum', forumRouter);

app.use((err, req, res, next) => {
  console.error("ERRO CAPTURADO:", err.message);
  
  const status = err.statusCode || 500;
  res.status(status).json({ 
    erro: err.message,
    status: status
  });
});

export default app;

