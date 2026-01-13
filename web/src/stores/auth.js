import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
    const storedUser = localStorage.getItem('auth_user');
    let parsedUser = null;
    try {
        if(storedUser && storedUser !== 'undefined') {
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

    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    const register = async (email, password, name) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                name,
            });
  
            user.value = response.data.user;
            token.value = response.data.token;

            localStorage.setItem('auth_user', JSON.stringify(user.value));
            localStorage.setItem('auth_token', token.value);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed';
            throw error.value;
        } finally {
            loading.value = false;
        }
    }

    const login = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            user.value = response.data.user;
            token.value = response.data.token;

            localStorage.setItem('auth_user', JSON.stringify(user.value));
            localStorage.setItem('auth_token', token.value);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Login failed';
            throw error.value;
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
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