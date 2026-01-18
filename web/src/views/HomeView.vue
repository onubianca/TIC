<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="d-flex align-items-center m-2">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img :src="logo" alt="StarList Logo" width="60" height="60" class="d-inline-block align-text-top ms-3">
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
</template>

<script setup>
import {ref, computed, onMounted, customRef} from 'vue';
import {useAuthStore} from '../stores/auth';
import {useRouter} from 'vue-router';
import logo from '../assets/site_logo.png';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';

const movies = ref([]);
const selectedMovie = ref(null);
const auth = useAuthStore();
const currentUser = computed(() => auth.user);
const router = useRouter();

onMounted(async () => {
    try {
        const response = await fetch('/movies');
        movies.value = await response.json();
    } catch (error) {
        console.error('Failed to fetch movies:', error);
    }
});

const openMovieModal = (movie) => {
    selectedMovie.value = movie;
};

const handleLogout = () => {
    auth.logout();
    router.push('/login');
};
</script>

<style>

</style>