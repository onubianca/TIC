<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div class="d-flex align-items-center m-1">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img :src="logo" alt="StarList Logo" width="60" height="60" class="d-inline-block align-text-top ms-3" @click="refreshPage">
                    <span class="fw-bold fst-italic fs-3 ms-2">StarList Review</span>
                </a>
            </div>
            <div class="d-flex ms-auto me-3">
                <button v-if="!currentUser" class="btn btn-outline-dark me-2" @click="showLoginView = true">Login</button>
                <button v-if="currentUser && currentUser.role === 'admin'" class="btn btn-dark" @click="openAddMovieView">Add Movie</button>
                <button v-if="currentUser && currentUser.role === 'user'" class="btn btn-dark" @click="openWatchlistView">My Watchlist</button>
                <button v-if="currentUser" @click="handleLogout" class="btn btn-outline-dark ms-2">Logout</button>
            </div>

        </nav>
    </div>
    <div class="container mt-5" style="padding-top: 70px;">
        <div class="row g-3">
            <div class="col-12 col-md-6 col-xl-4 d-flex mb-2" v-for="movie in movies" :key="movie.movieId" >
                <MovieCard :movie="movie" @view-details="selectedMovie = $event" class="w-100"/>
            </div>    
            <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
        </div>
        <AddMovieView v-if="showAddMovieView" @close="showAddMovieView = false; refreshPage()" />
        <WatchlistView v-if="showWatchlistView" @close="showWatchlistView = false" />
        <LoginView v-if="showLoginView" @close="showLoginView = false" @go-register="showLoginView = false; showRegisterView = true" />
        <RegisterView v-if="showRegisterView" @close="showRegisterView = false" @go-login="showRegisterView = false; showLoginView = true" />
    </div>
    <footer class="bg-dark text-center text-light py-3 mt-5 shadow-sm">
                <div class="container">
                    <p class="mb-0">&copy; 2026 StarList Review. All rights reserved.</p>
                </div>
    </footer>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useAuthStore} from '../stores/auth';
import logo from '../assets/site_logo.png';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';
import WatchlistView from '../views/WatchlistView.vue';
import AddMovieView from '../views/AddMovieView.vue';
import LoginView from './LoginView.vue';
import RegisterView from './RegisterView.vue';
import axios from 'axios';


const movies = ref([]);
const selectedMovie = ref(null);
const loading = ref(false);
const page = ref(1);
const limit = 3;
const API_URL = 'http://localhost:3000';

const auth = useAuthStore();
const currentUser = computed(() => auth.user);

const showWatchlistView = ref(false);
const showAddMovieView = ref(false);
const showLoginView = ref(false);
const showRegisterView = ref(false);

const lastDocId = ref(null);  

const loadMovies = async () => {
    if (loading.value) 
        return;
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/movies`, {
            params: {
                limit: limit,
                lastDocId: lastDocId.value
            }
        });
        const data = response.data.movies;
        const newLastDocId = response.data.lastDocId;
        if(data.length && newLastDocId !== null){      
            movies.value.push(...data);
            lastDocId.value = newLastDocId;
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

const handleLogout = () => {
    auth.logout();
};

const refreshPage = () => {
    page.value = 1;
    movies.value = [];
    lastDocId.value = null; // <- adaugă
    loading.value = false;
    loadMovies();
};

const openWatchlistView = () => {
    if(!currentUser.value){
        alert('Please log in to view your watchlist.');
        return;
    }
    showWatchlistView.value = true;
};
const openAddMovieView = () => {
    showAddMovieView.value = true;
};
</script>

<style>
footer{
    position: relative;
    bottom: 0;
    width: 100%;
}

</style>