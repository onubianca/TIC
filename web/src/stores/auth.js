import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { auth } from '../firebase';
import { 
    signInWithEmailAndPassword, 
    signInWithCustomToken, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';

const API_URL = 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
    // Pre-initialize from localStorage for instantaneous UI rendering
    const storedUser = localStorage.getItem('auth_user');
    let parsedUser = null;
    try {
        if (storedUser && storedUser !== 'undefined') {
            parsedUser = JSON.parse(storedUser);
        }
    } catch (e) {
        localStorage.removeItem('auth_user');
    }
    const user = ref(parsedUser);

    const storedToken = localStorage.getItem('auth_token');
    const token = ref(storedToken && storedToken !== 'undefined' ? storedToken : null);

    const loading = ref(false); 
    const error = ref(null);

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const isUser = computed(() => user.value?.role === 'user');

    // Helper to set token and axios headers
    const setToken = (newToken) => {
        token.value = newToken;
        if (newToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            localStorage.setItem('auth_token', newToken);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('auth_token');
        }
    };

    // Initialize axios header if token exists from localStorage
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    // Listen to Firebase Auth state changes to keep session verified and in-sync
    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const idToken = await firebaseUser.getIdToken(true);
            const decodedToken = await firebaseUser.getIdTokenResult();
            
            user.value = {
                userId: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User',
                role: decodedToken.claims.role || 'user'
            };
            setToken(idToken);
            localStorage.setItem('auth_user', JSON.stringify(user.value));
        } else {
            user.value = null;
            setToken(null);
            localStorage.removeItem('auth_user');
        }
    });

    const register = async (email, password, name, role = 'user') => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                name,
                role
            });
  
            const { customToken } = response.data;
            await signInWithCustomToken(auth, customToken);
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const login = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (err) {
            error.value = err.message || 'Login failed';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isAdmin,    
        isUser,
        register,
        login,
        logout,
    };
});