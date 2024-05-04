const API_KEY = 'e4a84d9378c3db262d591cbe6cd51d64'; // 여기에 TMDB API 키를 입력하세요.
// const MOVIE_ID = '372754'; // 원하는 영화의 ID 입력 필요.
const baseURL = 'https://api.themoviedb.org/3';
const imageURL = 'https://image.tmdb.org/t/p/original';

// const init = async () => {
// 	const url = new URL(window.location.href);
	
// 	const id = Number(url.searchParams.get("id"));
	
// 	const baseUrl = `https://api.themoviedb.org/3/movie/${id}?language=en-US?api_key=${API_KEY}`;
	
// 	const result = await fetch(baseUrl);
	
// 	const data = await result.json();
	
// 	console.log(data)
// }

function getMovieId () {
    const url = new URL(window.location.href);
    const MOVIE_ID = Number(url.searchParams.get("id"));

    return MOVIE_ID;
}

// 출연진 표시
async function fetchCast(movieId) {
    const url = `${baseURL}/movie/${movieId}/credits?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const castList = document.getElementById('cast-list');

    data.cast.slice(0, 5).forEach((actor) => { // 상위 5명의 출연진만 표시
        const actorDiv = document.createElement('div');
        actorDiv.classList.add('actor');

        const actorImg = document.createElement('img');
        actorImg.src = `${imageURL}${actor.profile_path}`;
        actorImg.alt = `Image of ${actor.name}`;
        actorImg.onerror = () => {
            actorImg.src = '/img/DefaultProfile.png'; // 오류 발생 시 기본 프로필 이미지
        };

        const actorName = document.createElement('div');
        actorName.classList.add('actor-name');
        actorName.textContent = actor.name;

        actorDiv.appendChild(actorImg);
        actorDiv.appendChild(actorName);
        castList.appendChild(actorDiv);
    });
}

// 영화 세부 정보 및 포스터 추가
async function fetchMovieDetails(movieId) {
    // 영화 이미지 정보 가져오기
    const url = `${baseURL}/movie/${movieId}/images?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // 기존에 존재하는 포스터 이미지 요소를 찾아 제거
    const existingPoster = document.querySelector('#movie-poster');
    if (existingPoster) {
        existingPoster.remove();
    }

    // 영화 포스터 설정
    const rightSideElement = document.querySelector('.right_side');
    if (data.posters && data.posters.length > 0) {
        const posterImage = data.posters[0]; // 첫 번째 포스터 이미지
        const posterURL = `${imageURL}${posterImage.file_path}`;

        const posterImgElement = document.createElement('img');
        posterImgElement.src = posterURL;
        posterImgElement.alt = 'Movie Poster';

        // id 속성 추가하여 CSS 규칙이 적용되도록 함
        posterImgElement.id = 'movie-poster';

        rightSideElement.appendChild(posterImgElement);
    } else {
        console.log('적합한 포스터 이미지를 찾을 수 없습니다.');
    }



    // 배경 이미지 설정
    if (data.backdrops && data.backdrops.length > 1) {
        const secondImage = data.backdrops[1]; // 두 번째 이미지
        const backgroundURL = `${imageURL}${secondImage.file_path}`;

        // #details 요소의 배경 이미지로 설정
        const detailsElement = document.getElementById('details');
        detailsElement.style.backgroundImage = `url('${backgroundURL}')`;
    } else {
        console.log('적합한 배경 이미지를 찾을 수 없습니다.');
    }
}

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


// 페이지 로드 시 실행되는 함수들
document.addEventListener('DOMContentLoaded', () => {
    const MOVIE_ID = getMovieId();
    fetchCast(MOVIE_ID);
    fetchMovieDetails(MOVIE_ID);
});