import express from 'express';
import cors from 'cors';
import dontev from 'dotenv';
import { db } from './config/firebaseConfig.js'; 
import path from 'path';
import movieRoutes from './routes/movies.js';   
import authRoutes from './routes/auth.js';     


const app = express();
dontev.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/movies', movieRoutes); 
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../web' });
});

app.use(express.static('../web'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;