/*async function fetchMovies() {
    try {
        const res = await fetch('http://localhost:3000/movies');
        const data = await res.json();
        const movies =  data;

        const container = document.getElementById('movie-container');
        container.innerHTML = '';

        if (!movies || movies.length === 0) {   
            container.innerHTML = '<p>No movies found.</p>';
            return;
        }

       movies.forEach(movie => { 
            const posterURL = movie.posterUrl && movie.posterUrl.trim() !== '' ? movie.posterUrl : 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg';
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4 d-flex';
            col.innerHTML = `
               <div class="movie-card w-100">
                    <img src="${movie.posterUrl}" alt="${movie.title} Poster" class="movie-poster" onerror="this.src='https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg'"/>
                    <div class="movie-details"> 
                        <h2 class="movie-title mt-mb-3">${movie.title} (${movie.year})</h2>
                        <p class="movie-genres">${movie.genres.join(', ')}</p>
                        <p class="movie-director"><strong>Director:</strong> ${movie.director}</p>
                        <p class="movie-actors"><strong>Actors:</strong> ${movie.actors.map(actor => actor.name).join(', ')}</p>
                        <p class="movie-description">${movie.description}</p>
                    </div>
                    <button class="btn btn-dark" onclick="fillEditForm(${JSON.stringify(movie)})">Edit</button>
                    <button class="btn btn-dark" onclick="deleteMovie('${movie.id}')">Delete</button>
                </div>
            `;
            container.appendChild(col);

        });
    }
    catch (error) {
        console.error('Error fetching movies:', error);
    }
        
}

 fetchMovies(); 
*/