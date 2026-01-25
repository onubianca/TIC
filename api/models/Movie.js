import {db} from '../config/firebaseConfig.js';

const moviesCollection = db.collection('movies');

export const Movie = {

    findAll: async ({limit = 3, lastDocId} = {}) => {  
        try{
            let query = moviesCollection.orderBy('createdAt', 'desc').limit(limit);

            if (lastDocId) {
                const lastDocSnap = await moviesCollection.doc(lastDocId).get();
                if (lastDocSnap.exists) {
                    query = query.startAfter(lastDocSnap);
                }
            }

            const snapshot = await query.get();
            const movies = snapshot.docs.map(doc => ({ movieId: doc.id, ...doc.data() }));
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            return {
                movies,
                lastDocId: lastDoc ? lastDoc.id : null
            };
        }   
        catch (error){
            console.error('Error in findAll:', error);
            throw error;
        }
    },

    findById: async (movieId) => {
        const doc = await moviesCollection.doc(movieId).get();
        if (!doc.exists) {
            return null;
        }
        return { movieId: doc.id, ...doc.data() };
    },

    create: async (movieData) => {
        const docRef = await moviesCollection.add({
            ...movieData, 
            rating: { average: 0, count: 0 }, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() });
        return docRef.id;
    },

    update: async (movieId, updateData) => {
        await moviesCollection.doc(movieId).update({
            ...updateData, 
            updatedAt: new Date().toISOString() });
        return Movie.findById(movieId);
    },

    delete: async (movieId) => {
        await moviesCollection.doc(movieId).delete();
    }

};