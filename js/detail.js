import { setLocalStorage, getLocalStorage } from "./localstorageGetSet.js";
import { basicReviews, basicUsers } from "./basicData.js";
import { handleLoginLogout, changeTopLoginStatus, drawLoginState } from "./signInSignOut.js";

const API_KEY = 'e4a84d9378c3db262d591cbe6cd51d64'; // 여기에 TMDB API 키를 입력하세요.
// const MOVIE_ID = '372754'; // 원하는 영화의 ID 입력 필요.
const baseURL = 'https://api.themoviedb.org/3';
const imageURL = 'https://image.tmdb.org/t/p/original';

const loginBtn = document.querySelector('.loginout'); // 로그인 버튼
const joinBtn = document.querySelector('.join'); // 회원가입 버튼
const reviewArea = document.querySelector('.reviews'); // 개별 리뷰들이 부착될 div
const reviewForm = document.querySelector('.review-form'); // 리뷰 작성 form
const userReview = document.querySelector('.user-review'); // 리뷰 input

// 쿼리스트링에서 영화 id 값 찾아오는 함수
export function getMovieId () {
    const url = new URL(window.location.href);
    const MOVIE_ID = Number(url.searchParams.get("id"));

    return MOVIE_ID;
}

// 발표를 위해 기본적으로 데이터가 있는 것처럼 해주는 로컬스토리지 set 함수
const setFirstLocalStorage = () => {
    const reviews = getLocalStorage('reviews');
    const users = getLocalStorage('users');

    // 처음 접속해도 기본적인 데이터가 있는 것처럼  
    if(reviews && users && reviews === basicReviews && users === basicUsers) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
        localStorage.setItem('users', JSON.stringify(users));
    }else if(!reviews && !users && reviews !== basicReviews && users !== basicUsers){
        localStorage.setItem('reviews', JSON.stringify(basicReviews));
        localStorage.setItem('users', JSON.stringify(basicUsers));
    }
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

// const movieId = 278; // 일단 고정값, 추후 받아올 것

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

// 리뷰 html 만들어서 렌더링
export const drawReviews = (reviews, MOVIE_ID, id = null) => {
    if(!reviews) return;
    const filtered = reviews.filter(e => e.movieId === MOVIE_ID);

    const mapped = filtered.map(e => {
        return `
            <div class="review_box">
                <p class="review_text">${e.reviews}</p>${id === e.id ? '<p class="del_up_box"><span class="del">글삭제</span><span class="update">글수정</span></p>' : ''}
                <div class="update_box">
                    <input type='text' class='update_input' placeholder='${e.reviews}'></input>
                    <button class="update_button">수정하기</button>
                </div>
            </div>
        `;
    }).join('');

    reviewArea.innerHTML = '';
    reviewArea.insertAdjacentHTML('beforeend', mapped);
}

// 회원가입 버튼 핸들러
const handleJoin = () => window.location.href = '/join.html';

// 리뷰 제출 form 핸들러
const handleReviewSubmit = (e, isLogIn, MOVIE_ID) => {
    e.preventDefault();
    if(!isLogIn) return;

    const review = userReview.value; 
    const prevReviews = getLocalStorage('reviews');

    let reviewObj = [];

    if(prevReviews){
        reviewObj = [...prevReviews, {
            id : isLogIn.id,
            movieId : MOVIE_ID,
            reviews : review
        }]
    }else{
        reviewObj = [{
            id : isLogIn.id,
            movieId : MOVIE_ID,
            reviews : review
        }]
    }

    setLocalStorage('reviews', JSON.stringify(reviewObj));
    const reviews = getLocalStorage('reviews');
    drawReviews(reviews, MOVIE_ID, isLogIn.id);
}

// 리뷰 수정, 삭제 핸들러
const handleReviewDelUpdate = (MOVIE_ID) => (e) => {
    const user = getLocalStorage('islogin');
    const curr = e.currentTarget.children[0].textContent.replace(' 글삭제 글수정', '');
    const value = e.target.classList.value;
    const reviews = getLocalStorage('reviews');

    if(value && value === 'del'){
        const filtered = reviews.filter((e) => e.review !== curr);
        setLocalStorage('reviews', JSON.stringify(filtered));
        drawReviews(filtered, MOVIE_ID, user.id);
    }else if(value && value === 'update'){
        const updateBox = e.currentTarget.children[2];
        const updateInput = e.currentTarget.children[2].children[0];
        const updateButton = e.currentTarget.children[2].children[1];
        updateBox.style.display = 'inline';
        updateButton.addEventListener('click', () => {
            const updateText = updateInput.value;
            const mapped = reviews.map((e) => {
                if(e.reviews === curr){
                    return {
                        id : e.id,
                        movieId : MOVIE_ID,
                        reviews : updateText
                    }
                }else{
                    return e
                }
            });
            setLocalStorage('reviews', JSON.stringify(mapped));
            drawReviews(mapped, MOVIE_ID, user.id);
        })
    }
}

// mutation Observer 로 리뷰 추가될때마다 감시하려고 합니다. 아래는 옵션 객체 입니다.
const config = { attributes: true, childList: true, subtree: true };

// mutation Observer 의 콜백
const mutationObserverCallback = (MOVIE_ID) => (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // 변경시 === 리뷰 삭제 혹은 추가시 마다 이벤트리스너 재부착
            mutation.addedNodes.forEach(e => e.addEventListener('click', handleReviewDelUpdate(MOVIE_ID)));
        } else if (mutation.type === "attributes") {
            console.log(`${mutation.attributeName} 특성이 변경됐습니다.`);
        }
    }
};

// init 함수
const init = () => {
    const isLogIn = getLocalStorage('islogin');
    const reviews = getLocalStorage('reviews');

    setFirstLocalStorage();

    const MOVIE_ID = getMovieId();
    setLocalStorage('movieid', MOVIE_ID);
    fetchCast(MOVIE_ID);
    fetchMovieDetails(MOVIE_ID);
    changeTopLoginStatus();

    loginBtn.addEventListener('click', (e) => handleLoginLogout(e, MOVIE_ID));
    joinBtn.addEventListener('click', handleJoin);
    reviewForm.addEventListener('submit', (e) => handleReviewSubmit(e, isLogIn, MOVIE_ID));

    drawLoginState(isLogIn);
    isLogIn.isLogin ? drawReviews(reviews, MOVIE_ID, isLogIn.id) : drawReviews(reviews, MOVIE_ID);

    getRecommandMovieList(MOVIE_ID).then((list) => {
        console.log(list);
        const html = list.results
            .slice(0, 5)
            .map((movie) => makeMovieHtml(movie))
            .join("");
        document.querySelector(".recommendations > .content").innerHTML = html;
    });

    const reviewsBox = document.querySelectorAll('.review_box');
    if(reviewsBox) reviewsBox.forEach(e => e.addEventListener('click', handleReviewDelUpdate(MOVIE_ID)))

    // 콜백 함수에 연결된 감지기 인스턴스 생성
    const observer = new MutationObserver(mutationObserverCallback(MOVIE_ID));
    observer.observe(reviewArea, config);
}

// init
document.addEventListener('DOMContentLoaded', init);