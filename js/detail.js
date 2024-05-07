const API_KEY = 'e4a84d9378c3db262d591cbe6cd51d64'; // 여기에 TMDB API 키를 입력하세요.
const MOVIE_ID = '372754'; //일단 고정된 아이디 추후 uml에서 가지고올 예정 
const baseURL = 'https://api.themoviedb.org/3';
const imageURL = 'https://image.tmdb.org/t/p/original';

// 출연진 표시
async function fetchCast() {
    const url = `${baseURL}/movie/${MOVIE_ID}/credits?api_key=${API_KEY}`;
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

async function fetchMovieDetails() {
    // 영화 상세 정보를 포함하여 포스터 가져오기
    const detailsUrl = `${baseURL}/movie/${MOVIE_ID}?api_key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    // 이미지 정보 가져오기 (포스터 및 배경)
    const imageUrl = `${baseURL}/movie/${MOVIE_ID}/images?api_key=${API_KEY}`;
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.json();

    // 기존에 존재하는 포스터 이미지 요소를 찾아 제거
    const existingPoster = document.querySelector('#movie-poster');
    if (existingPoster) {
        existingPoster.remove();
    }

    const rightSideElement = document.querySelector('.right_side');

    // 영화 포스터 설정
    if (detailsData.poster_path) {
        const posterURL = `${imageURL}${detailsData.poster_path}`;
        const posterImgElement = document.createElement('img');
        posterImgElement.src = posterURL;
        posterImgElement.alt = 'Movie Poster';
        posterImgElement.id = 'movie-poster';

        rightSideElement.appendChild(posterImgElement);

        // 영화 제목 추가
        const titleElement = document.createElement('div');
        titleElement.textContent = detailsData.title;
        titleElement.className = 'movie-title';

        rightSideElement.appendChild(titleElement);
        // 영화 평점 추가
        const ratingElement = document.createElement('div');
        ratingElement.textContent = `평점: ${detailsData.vote_average} / 10`;
        ratingElement.className = 'movie-rating';
        rightSideElement.appendChild(ratingElement);
    } else {
        console.log('적합한 포스터 이미지를 찾을 수 없습니다.');
    }

    // 배경 이미지 설정
    if (imageData.backdrops && imageData.backdrops.length > 0) {
        const secondImage = imageData.backdrops[1]; // 두 번째 배경 이미지 사용
        const backgroundURL = `${imageURL}${secondImage.file_path}`;

        // #details 요소의 배경 이미지로 설정
        const detailsElement = document.getElementById('details');
        detailsElement.style.backgroundImage = `url('${backgroundURL}')`;
        detailsElement.style.backgroundSize = 'cover';  // 배경 이미지를 커버로 설정
    } else {
        console.log('적합한 배경 이미지를 찾을 수 없습니다.');
    }
}


// 페이지 로드 시 실행되는 함수들
document.addEventListener('DOMContentLoaded', () => {
    fetchCast();
    fetchMovieDetails();
});
