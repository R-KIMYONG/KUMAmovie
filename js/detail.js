const movieId = 278; // 일단 고정값, 추후 받아올 것

getRecommandMovieList(movieId).then((list) => {
	console.log(list);
	const html = list.results
		.slice(0, 5)
		.map((movie) => makeMovieHtml(movie))
		.join("");
	document.querySelector(".recommendations > .content").innerHTML = html;
});

async function getRecommandMovieList(movieId) {
	return fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2Q0ZmVkNjFhOWJlYzIwMzMzOGM4ZDQ0YjI4N2Q4OSIsInN1YiI6IjY2Mjg3NTc2MTc2YTk0MDE2NjgyMDlkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o_kqyGpLPOWQA3Ye2wXP63XwItH3ceGKBySBV7CtrRs"
		}
	}).then((response) => response.json());
}

function makeMovieHtml(movie) {
	return `
        <div class="recommend-movie" movie-id="${movie.id}">
            <div class="poster"><img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"></div>
            <div class="info">
                <div class="title">${movie.title}</div>
                <div class="vote">
                    <span class="avg">${movie.vote_average.toFixed(1)}</span> 
                    <span class="cnt">(${movie.vote_count})</span>
                </div>
            </div>
        </div>`;
}
