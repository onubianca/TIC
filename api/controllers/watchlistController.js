import {db} from '../config/firebaseConfig.js';
import admin from 'firebase-admin';

export async function addToWatchlist(req, res) {
    try {
        const userId = req.user.userID;
        const {movieId} = req.body;

        if (!movieId) {
            return res.status(400).json({ message: 'movieId is required' });
        }

        await db.collection('users').doc(userId).set({
            watchlist: admin.firestore.FieldValue.arrayUnion(movieId)
        }, { merge: true });
         
        res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add movie to watchlist' });
    }
}

export async function getWatchlist(req, res) {
    try {
        const userId = req.user.userID;
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(200).json({ movies: [] });
        }

        const watchlistIds = userDoc.data().watchlist || [];
        if(watchlistIds.length === 0) {
            return res.status(200).json({ movies: [] });
        }

        const moviesPromises = watchlistIds.map(id =>
            db.collection('movies').doc(id).get()
        );

        const moviesDocs = await Promise.all(moviesPromises);

        const movies = moviesDocs.filter(doc => doc.exists).map(doc => ({ id: doc.id, title: doc.data().title}));

       res.status(200).json({ movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
}

export async function removeFromWatchlist(req, res) {
    try {
        const userId = req.user.userID;
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ message: 'movieId is required' });
        }

        await db.collection('users').doc(userId).update({
            watchlist: admin.firestore.FieldValue.arrayRemove(movieId)
        });
         
        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove movie from watchlist' });
    }
}