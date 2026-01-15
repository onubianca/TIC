<template>
    <div class="container mt-4">
        <h1 class="m-4 fst-italic fw-bold"><img :src="logo" class="logo">StarList Reviews</h1>
        <div class="row g-3">
            <div class="col-12 xol-md-6 col-xl-4 d-flex mb-2" v-for="movie in movies" :key="movie.movieId" >
                <MovieCard :movie="movie" @view-details="selectedMovie = $event" class="w-100"/>
            </div>    
            <MovieModal v-if="selectedMovie" :movie="selectedMovie" @close="selectedMovie = null" />
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import logo from '../assets/site_logo.png';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';

const movies = ref([]);
const selectedMovie = ref(null);

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
</script>

<style>

</style>