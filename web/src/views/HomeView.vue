<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="d-flex align-items-center m-2">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img :src="logo" alt="StarList Logo" width="60" height="60" class="d-inline-block align-text-top ms-3" @click="refreshPage">
                    <span class="fw-bold fst-italic fs-3 ms-2">StarList Review</span>
                </a>
            </div>
            <div class="d-flex ms-auto me-3">
                <router-link v-if="!currentUser" to="/login" class="btn btn-outline-dark me-2">Login</router-link>
                <button v-if="currentUser && currentUser.role === 'admin'" class="btn btn-dark">Add Movie</button>
                <button v-if="currentUser && currentUser.role === 'user'" class="btn btn-dark">Watchlist</button>
                <button v-if="currentUser" @click="handleLogout" class="btn btn-outline-dark ms-2">Logout</button>
            </div>

        </nav>
    </div>
    <div class="container mt-4">
        <div class="row g-3">
            <div class="col-12 col-md-6 col-xl-4 d-flex mb-2" v-for="movie in movies" :key="movie.movieId" >
                <MovieCard :movie="movie" @view-details="selectedMovie = $event" class="w-100"/>
            </div>    
            <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
        </div>
    </div>
    <footer class="bg-dark text-center text-light py-3 mt-5 shadow-sm">
                <div class="container">
                    <p class="mb-0">&copy; 2026 StarList Review. All rights reserved.</p>
                </div>
    </footer>
</template>

<script setup>
import {ref, computed, onMounted, customRef, onUnmounted} from 'vue';
import {useAuthStore} from '../stores/auth';
import {useRouter} from 'vue-router';
import logo from '../assets/site_logo.png';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';
import axios from 'axios';

const movies = ref([]);
const selectedMovie = ref(null);
const loading = ref(false);
const page = ref(1);
const limit = 3;
const API_URL = 'http://localhost:3000';

const auth = useAuthStore();
const currentUser = computed(() => auth.user);
const router = useRouter();

const loadMovies = async () => {
    if (loading.value) 
        return;
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/movies`, {
            params: {
                page: page.value,
                limit: limit
            }
        });
        const data = response.data;
        if(data.length){       
            movies.value.push(...data);
            page.value += 1;
     }
    } catch (error) {
        console.error('Failed to load movies:', error);
    } finally {
        loading.value = false;
    }
};

const handleScroll = () => {
   const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
    if (bottom) {
         loadMovies();
    }
};

onMounted(async () => {
    loadMovies();
    window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
});

const openMovieModal = (movie) => {
    selectedMovie.value = movie;
};

const handleLogout = () => {
    auth.logout();
    router.push('/login');
};

const refreshPage = () => {
    page.value = 1;
    movies.value = [];
    loadMovies();
};
</script>

<style>
footer{
    position: relative;
    bottom: 0;
    width: 100%;
}

</style>