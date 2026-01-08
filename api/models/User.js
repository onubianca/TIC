import {db} from '../config/firebaseConfig.js';

const usersCollection = db.collection('users');

export const User = {
    findByEmail: async (email) => {
        const snapshot = await usersCollection.where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        const userDoc = snapshot.docs[0];
        return { userId: userDoc.id, ...userDoc.data() };
      
    },

    findById: async (userId) => {
            const doc = await usersCollection.doc(userId).get();
            if (!doc.exists) {
                return null;
            }
            return { userId: doc.id, ...doc.data() };
    },

    create: async (userData) => {
        const docRef = await usersCollection.add({
            ...userData,
            watchlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return docRef.id;
    },

    addToWatchlist: async (userId, movieId) => {
        await usersCollection.doc(userId).update({
            watchlist: db.FieldValue.arrayUnion(movieId),
            updatedAt: new Date().toISOString()
        });
    },

    removeFromWatchlist: async (userId, movieId) => {
        await usersCollection.doc(userId).update({
            watchlist: db.FieldValue.arrayRemove(movieId),
            updatedAt: new Date().toISOString()
        });
    },

    getWatchlist: async (userId) => {
        const doc = await usersCollection.doc(userId).get();
        return doc.data()?.watchlist || [];
    }
};