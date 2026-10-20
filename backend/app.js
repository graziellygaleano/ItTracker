import express from 'express';
import cors from 'cors';
import DAO from './repositories/dao.js'; 

export const app = express();
const db = new DAO();

app.use(cors()); 
app.use(express.json());  


app.get('/api', (req, res) => {
  res.json({ status: 'API online' });
});

app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);

export default app;

