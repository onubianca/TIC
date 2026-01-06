async function fetchMovies() {
    try {
        const res = await fetch('http://localhost:3000/movies');
        const data = await res.json();
        const movies =  data.movies;

        const container = document.getElementById('movie-container');
        container.innerHTML = '';

        if (!movies || movies.length === 0) {   
            container.innerHTML = '<p>No movies found.</p>';
            return;
        }

       movies.forEach(movie => {  
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.posterUrl}" alt="${movie.title} Poster" class="movie-poster"/>
                <div class="movie-details"> 
                    <h2 class="movie-title">${movie.title} (${movie.year})</h2>
                    <p class="movie-genres">${movie.genres.join(', ')}</p>
                    <p class="movie-director"><strong>Director:</strong> ${movie.director}</p>
                    <p class="movie-actors"><strong>Actors:</strong> ${movie.actors.map(actor => actor.name).join(', ')}</p>
                    <p class="movie-description">${movie.description}</p>
                    <button class="btn btn-dark" onclick="fillEditForm(${JSON.stringify(movie)})">Edit</button>
                    </button class="btn btn-dark" onclick="deleteMovie('${movie.id}')">Delete</button>
                </div>
            `;
            container.appendChild(movieCard);

        });
    }
    catch (error) {
        console.error('Error fetching movies:', error);
    }
        
}

 fetchMovies(); 