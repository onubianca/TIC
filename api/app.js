import express from 'express';
import cors from 'cors';
import { db } from './config/firebaseConfig.js'; //II
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

//II
app.get('/movies', async(req, res) => {
    try {
        const snapshot = await db.collection('movies').get();
        const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${movies.length} movies`);
        res.json({ movies });
    }
    catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Error fetching movies' });
}});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../web' });
});

app.use(express.static('../web'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;