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
        const watchlistDoc = await db.collection('watchlists').doc(userId).get();

        if (!watchlistDoc.exists) {
            return res.status(200).json({ movies: [] });
        }

        const watchlistData = watchlistDoc.data();
        res.status(200).json({ movies: watchlistData.movies || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
}