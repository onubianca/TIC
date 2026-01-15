<template>
    <div class="movie-card card h-100 d-flex flex-column " style="width: 22rem;">     
        
            <img :src="movie.posterUrl" :alt="movie.title" class="card-img-top"  @error="posterError" />

            <div class="card-info d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center m-3">
                    <h4 class="card-title mb-0">{{ movie.title }}</h4>
                    <button class="btn btn-dark btn-details" @click="$emit('view-details', movie)">
                        View Details
                    </button>
                </div>
            </div>
    </div>
</template>

<script setup>
defineProps({movie: Object});
defineEmits(['view-details']);

const posterFallback = 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg';

const posterError = (event) => {
    event.target.src = posterFallback;
}

</script>
<style>
.card-img-top {
    width: 100%;
    height: 700px;
    object-fit: cover;
}

.movie-card {
    display: flex;
    flex-direction: column;
    
}

</style>