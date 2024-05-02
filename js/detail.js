const API_KEY = 'e4a84d9378c3db262d591cbe6cd51d64'; // 여기에 TMDB API 키를 입력하세요.
const MOVIE_ID = '372754'; // 원하는 영화의 ID 입력 필요.
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

// 영화 세부 정보 및 포스터 추가
async function fetchMovieDetails() {
    // 영화 이미지 정보 가져오기
    const url = `${baseURL}/movie/${MOVIE_ID}/images?api_key=${API_KEY}`;
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

// 페이지 로드 시 실행되는 함수들
document.addEventListener('DOMContentLoaded', () => {
    fetchCast();
    fetchMovieDetails();
});
