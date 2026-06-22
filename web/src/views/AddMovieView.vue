<template>
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-card p-4 bg-white rounded shadow" style="width: 400px; max-width: 90%"> 
        <h3 class="text-center mb-3">Add Movie</h3>  
        <form @submit.prevent="handleAddMovie" >  
          <div class="mb-3">
            <input type="text" v-model="form.title" class="form-control" placeholder="Title" required/>
          </div>
          <div class="mb-3">
            <input type="text" v-model="form.director" class="form-control" placeholder="Director" required/>
          </div>
          <div class="mb-3">
            <input type="number" v-model="form.year" class="form-control" placeholder="Year" required/>
          </div>
            <div class="mb-3">
                <input type="number" v-model="form.runtime" class="form-control" placeholder="Runtime (minutes)" required/>
            </div>
            <div class="mb-3">
                <input type="text" v-model="form.genres" class="form-control" placeholder="Genres (comma separated)" required/>
            </div>
            <div class="mb-3">
                <input type="text" v-model="form.actors" class="form-control" placeholder="Actors (comma separated)" required/>
            </div>
            <div class="mb-3">
                <textarea v-model="form.description" class="form-control" placeholder="Description" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <input type="text" v-model="form.posterUrl" class="form-control" placeholder="Poster URL" required/>
            </div>
            <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-dark">Add Movie</button>
                <button class="btn btn-dark" @click="$emit('close')">Close</button>  
            </div>
        </form>
    </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';

const emit = defineEmits(['movie-added']);
const form = ref({
    title: '',
    director: '',
    year: null,
    runtime: null,
    genres: '',
    actors: '',
    description: '',
    posterUrl: ''
});

const handleAddMovie = async () => {
    try {
        const playload = {
            title: form.value.title,
            director: form.value.director,
            year: form.value.year,
            runtime: form.value.runtime,
            genres: form.value.genres.split(',').map(genre => genre.trim()),
            actors: form.value.actors.split(',').map(actor => actor.trim()),
            description: form.value.description,
            posterUrl: form.value.posterUrl
        };
        const response = await axios.post('http://localhost:3000/movies', playload);
        alert('Movie added successfully!');
        emit('added', response.data);
        emit('close');
        } catch (error) {
        console.error('Failed to add movie:', error);
        alert(error.response?.data?.message || 'Failed to add movie.');
    }
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