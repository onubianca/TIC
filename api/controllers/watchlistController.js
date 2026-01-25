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

        const watchlist = userDoc.data().watchlist || [];
        const mpvies = [];

        for (const movieId of watchlist) {
            const movieDoc = await db.collection('movies').doc(movieId).get();
            if (movieDoc.exists) {
                mpvies.push({ id: movieDoc.id, title: movieDoc.data().title });
            }
        }

       res.status(200).json({ movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
}