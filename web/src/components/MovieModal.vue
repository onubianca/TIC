<template>
    <div class="modal-backdrop d-flex justify-content-center align-items-center" @click.self="$emit('close')">
      <div class="modal-card p-3 bg-white rounded shadow" style="max-width: 90%; width: 70%;">
        <div class="d-flex flex-row">
          <img 
            :src="movie.posterUrl" 
            :alt="movie.title" 
            class="img-fluid rounded" 
            style="width: 250px; height: auto; object-fit: cover; margin-right: 1rem;"
            @error="posterError"
          />
          <div class="flex-grow-1">
            <h3 class="mb-2">{{ movie.title }}</h3>
            <p><strong>Year:</strong> {{ movie.year }}</p>
            <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
            <p> {{ movie.description }}</p>
            <p><strong>Director:</strong> {{ movie.director }}</p>
            <p>
              <strong>Genres:</strong> 
              <span v-if="movie.genres && movie.genres.length">
                {{ movie.genres.join(', ') }} 
              </span>
              <span v-else>Not available</span>
            </p>
            <div class="mb-2">
              <strong>Cast:</strong>
              <ul class="list-unstyled">
                <li v-for="actor in actors" :key="actor.name" class="d-flex align-items-center">
                  <span class="me-2 text-secondary">★</span>
                  {{ actor.name }}
                </li>
              </ul>
            </div>
            <div class="mt-3 d-flex flex-wrap gap-2">
              <button v-if="auth.isUser" class="btn btn-dark" @click="addToWatchlist">Watchlist</button>
              <button v-if="auth.isAdmin" class="btn btn-dark" @click="createMovie">Add</button>
              <button v-if="auth.isAdmin" class="btn btn-dark" @click="UpdateMovie">Edit</button>
              <button v-if="auth.isAdmin" class="btn btn-dark" @click="DeleteMovie">Delete</button>
              <button class="btn btn-dark self-align-end" @click="$emit('close')">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({ movie: Object });
  const emit = defineEmits(['close']);
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const posterFallback = 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg';
  
  const posterError = (event) => {
    event.target.src = posterFallback;
  };
  
  const actors = props.movie.actors || [];
  
  const addToWatchlist = async () => {
    await fetch(`/watchlist`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ movieId: props.movie.id }),
    });
    alert('Movie added to watchlist!');
  };
  
  const UpdateMovie = async () => {
    router.push({ name: 'EditMovie', params: { id: props.movie.id } });
  };
  
  const DeleteMovie = async () => {
    if (confirm('Are you sure you want to delete this movie?')) {
      await fetch(`/movies/${props.movie.id}`, { method: 'DELETE' });
      alert('Movie deleted successfully!');
      emit('close');
    }
  };
  
  const createMovie = () => {
    router.push({ name: 'CreateMovie' });
  };
  </script>
  
  <style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1050;
  }
  </style>
  