<template>
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-card p-4 bg-white rounded shadow" style="width: 50%; max-width: 90%"> 
        <h3 class="text-center mb-3">My Watchlist</h3>  
        <ul class="list-group">
            <li v-for="movie in watchlist" :key="movie.movieId" class="list-group-item">{{ movie.title }}</li>
            <li v-if="watchlist.length === 0" class="list-group-item">My watchlist is empty</li>
        </ul>
        <button class="btn btn-dark self-align-end mt-3" @click="$emit('close')">Close</button>
      </div>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const watchlist = ref([]);
const auth = useAuthStore();

onMounted(async () => {
  if (!auth.token) return; 
  try {
    const response = await axios.get('http://localhost:3000/watchlist', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    watchlist.value = response.data.movies || [];
  } catch (error) {
    console.error('Failed to load watchlist:', error.response || error);
  }
});

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
