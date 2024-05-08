import { options } from "./options.js";
import { setSearchParams } from "./setSearchParams.js";

//비쥬얼에 나오는 영화의 제목 위치
const visualTitle = document.querySelector("#visual .content .intro .title");
//비쥬얼에 나오는 영화의 소개 위치
const movieContent = document.querySelector("#visual .content .intro .movie-content");
//비쥬얼에 나오는 영화의 포스터 위치
const poster = document.querySelector("#visual .content .poster"); //평점높은 영화를 비주얼에 배치
const visual = document.querySelector("#visual"); //비쥬얼 배경화면을 변경하기위해 찾음
const videoContainer = document.getElementById("videoContainer"); //여기는 트레일러영상을 담은 박스임
const iframe = document.querySelector("iframe");
const btnContent = document.querySelector(".btn-content"); // 유튜브 버튼
const searchIcon = document.querySelector(".search-icon"); //검색 버튼임
const searchInput = document.querySelector("#search-movie"); //검색창을 선택한거임
const searchOption = document.getElementById("search-option"); //검색옵션 선택임
const showMoreBtn = document.querySelector(".show-more"); // 더보기 버튼
const pageUl = document.querySelector("#category>nav>ul"); // 페이지네이션 담을 ul
const carouselBefore = document.querySelector('#carousel-before'); // 캐러셀 이전버튼
const carouselNext = document.querySelector('#carousel-next'); // 캐러셀 이후버튼'
const searchLine = document.querySelector(".search-line");
const movieArrUL = document.querySelector("#movie-array ul");
// 페이지네이션에서 선택된 페이지 넘버
let selectedPageNum = 0;
// 페이지네이션 무한 증가를 위해 누적되는 넘버(1부터 시작해야합니다)
let cumulativeNum = 1;
// 아래 두 개는 첫 fetch 때 tmdb의 전체 영화 총량을 혹시몰라서 저장해놓으려고 만들었습니다.
let total_pages = 0;
let total_results = 0;
// 무한? 페이지네이션 될 때(계속 fetch 받을때 마다) 누적되는 영화정보 어레이입니다(ex : 최초 array(20) * 5, 두번째 array(20) * 10 ...) 
let accMovies = [];
// 페이지네이션을 위해 다음과 같이 쌓이는 배열 입니다. [[1,2,3,4,5], [6,7,8,9,10], [11,12,13,14,15] ...]
let pagination = [];
// 임시방편인데요.. 페이지네이션 < > 버튼에서 뒤로 갔다가 다시 앞으로 갈 때는 fetch 를 막기 위한 flag 변수 입니다.
let beforeNextFlag = '';
// 캐러셀이 넘어갈 때 혹은 페이지네이션을 클릭해서 페이지가 변할 때, 현재 캐러셀 인덱스를 참조하기 위한 변수 입니다.
let currCarouselIndex = 0;
// setInterval 을 중지 재개 하기 위한 변수입니다.
let intervalNum;
// 페이지네이션 컨트롤을 위한 변수
let currPagination;
// 카루셀 마지막 넘어간 시간 측정용 변수
let lastTime = 0;
// 카루셀 인터벌
const interval = 3500; // 3.5초
// rAF cancel 을 위해 rAF를 담을 변수
let animationFrameId;
// 캐러셀 인덱스 계산용, 중첩 배열이라서.. [[],[],[], ...] 이런식으로
let carouselIndexControl = 0;
// 마지막 클릭 시간을 추적할 변수
let lastClickTime = 0;



const videoSrc = [
	"https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn", //1번영상
	"https://www.youtube.com/embed/UaVTIH8mujA?si=_kHWDc96Esbq0xb-", //2번영상
	"https://www.youtube.com/embed/9O1Iy9od7-A?si=iHQOHJqlyQ1ZiLmi", //3번영상 
	"https://www.youtube.com/embed/mxphAlJID9U?si=jUSmhcrYYA1LGsej", //4번영상
	"https://www.youtube.com/embed/TEN-2uTi2c0?si=3uTwAyRz26VjOBg2", //5번영상
	// "https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn" //6번영상
];

//menu 모달 in out
const menuModal = () => {
	const modal = document.querySelector("#menu-modal"); //모달을 찾음
	const menuBtn = document.querySelector("#menu"); //메뉴버튼을 찾음
	const closeBtn = document.querySelector("#close-modal"); //닫기 버튼을 찾음
	menuBtn.addEventListener("click", () => {
		modal.style.right = "0px";
	});
	closeBtn.addEventListener("click", () => {
		modal.style.right = "-350px";
	});
};

// 영화 모달 생성용
const cardModal = (item) => {
	const cardModalBox = document.getElementById("movie-modal");
	const template = `
		<div class="movie-poster">
			<img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}">
		</div>
		<div class="title">
			<p>영화 id : ${item.id}</p>
			<p>${item.original_title}</p>
			<p>평점 : ${item.vote_average}점</p>
			<p>요약 : ${item.overview}</p>
		</div>
		<button class='movie-modal-close'>
			<h3>닫기</h3>
			<span class="material-symbols-outlined">
				close
			</span>
		</button>`;
	cardModalBox.innerHTML = template; // 기존 내용 제거 후 새로운 내용 삽입
	document.querySelector(".movie-modal-close").addEventListener("click", (e) => {
		cardModalBox.style.top = "-850px";
	});
};

// 제목, 평점 별 검색어 가공
const searchKeyword = (item) => {
	const mySelect = searchOption.value;
	if (mySelect === "제목") {
		return item.toString().toLowerCase();
	} else if (mySelect === "평점") {
		return parseFloat(item);
	}
}

// 영화 카드 생성
const renderCardUi = (movieData) => {
	if (typeof movieData === "object") {
		movieArrUL.innerHTML = "";
		movieData.forEach((item, i) => {
			const rating = Math.round(item.vote_average);
			let template = `
				<li class='${item.id}'>
					<div class="movie-poster">
						<img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}">
					</div>
					<div class="title">
						<p>${item.original_title}</p>
						<div class="start-wrapper">
							<div class="star material-symbols-outlined">${rating === 1 ? 'star_half' : rating >= 2 ? 'star' : ''}</div>
							<div class="star material-symbols-outlined">${rating === 3 ? 'star_half' : rating >= 4 ? 'star' : ''}</div>
							<div class="star material-symbols-outlined">${rating === 5 ? 'star_half' : rating >= 6 ? 'star' : ''}</div>
							<div class="star material-symbols-outlined">${rating === 7 ? 'star_half' : rating >= 8 ? 'star' : ''}</div>
							<div class="star material-symbols-outlined">${rating === 9 ? 'star_half' : rating >= 10 ? 'star' : ''}</div>
							<!-- <p>평점 : ${rating}</p> -->
						</div>
					</div>
				</li>`;
				movieArrUL.insertAdjacentHTML("beforeend", template);

			const liList = document.querySelectorAll("#movie-array ul li");

			//한줄에 4개의 li를 배치 하기위해 css에 부여된 margin-right를 없애기
			for (let i = 3; i < liList.length; i += 4) {
				liList[i].style.marginRight = "0px";
			}
		});

		return movieData;
	} else {
		movieArrUL.innerHTML = "";
		movieArrUL.innerHTML = `<h3 style="color:#fff;font-size:40px;">${movieData}</h3>`;
	}
};

// 카드 클릭 시 실행
const handleCardClick = (e) => {
	const clickedCard = e.target;
	if (e.target.matches("#movie-array ul")) return;

	const clickedCardId = accMovies[selectedPageNum].filter((item) => {
		return item.id == clickedCard.closest("li").classList.value;
	});

	// 영화 디테일 페이지로 이동~
	const a = setSearchParams(clickedCardId[0].id);
	window.location.href = a;
}

// 페이지네이션 바뀔 때마다 상단부분(비쥬얼부분) 바꾸고(평점높은 영화로), 파라미터로 받은 데이터 배열 그대로 반환
const changeTopVisual = (data) => {
	// 평점이 가장 높은 영화 선택(data 배열 자체가 이미 평점정렬되서 넘어오므로 0 번 인덱스 선택) / 카루셀 자동넘김의 경우 그냥 data (객체)
	const topMovie = data.length ? data[0] : data;

	visualTitle.textContent = topMovie.original_title; //비주얼 영화제목을 평점높은영화거로
	movieContent.textContent = topMovie.overview; //위에 하는 작업과 동일한데 영화 줄거리가져옴
	poster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" alt="${topMovie.id}">`; //비쥬얼 포스트를 평점높은 영화걸로 바꿈
	visual.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${topMovie.backdrop_path}')`; //여기는 배경화면을 바꿈

	return data;
};

// 더보기 버튼 핸들러
const handleShowMore = () => {
	searchInput.focus();
	const data = changeTopVisual(accMovies[selectedPageNum]);
	renderCardUi(data);
}

// 검색버튼 핸들러
const handleSearch = () => {
	const Keyword = searchKeyword(searchInput.value); //유저가 검색창에 입력한 검색어 (만약에 검색어 앞 또는 뒤에 빈칸이 있으면 없앤다)

	let newArr = [];
	if (typeof Keyword === "string" && Keyword !== "") {
		newArr = accMovies[selectedPageNum].filter((item) => item.original_title.toLowerCase().includes(Keyword.trim()));
	} else if (typeof Keyword === "number" && Keyword !== "") {
		newArr = accMovies[selectedPageNum].filter((item) => parseInt(item.vote_average) === Keyword);
	}

	if (newArr.length !== 0) {
		renderCardUi(newArr);
	} else {
		renderCardUi(`${searchOption.value} ${searchInput.value}에 대한 검색결과가 없습니다.😅`);
	}
}

// 페이지네이션, 처음에 한번 호출되고 < > 클릭으로 페이지네이션 바뀔때마다 호출
const makePagination = (paginationArr, pageNum) => {
	// 매번 비우고 새로 그림
	pageUl.innerHTML = '';

	// 넘어오는 pageNum 에서 1을 빼거나 더해야 인덱스로 사용해서 배열에 접근 가능
	let beforePointer = pageNum - 1;
	let nextPointer = pageNum + 1;

	// 여긴 좀 비효율입니다만,.. 이전 이후 버튼도 그냥 새로 만듭니다 
	const before = document.createElement('li');
	before.setAttribute('class', 'before');
	before.style.width = 'fit-content';
	before.innerText = "<";
	before.setAttribute('data-pointer', beforePointer);

	const next = document.createElement('li');
	next.setAttribute('class', 'next');
	next.style.width = 'fit-content';
	next.innerText = '>';
	next.setAttribute('data-pointer', nextPointer);

	// 페이지네이션 배열을 활용하여 li 를 만듭니다.
	const result = paginationArr.map((e, i) => {
		const temp = `<li class=${e} id=${i}>${e}</li>`;
		return temp
	}).join('');

	// 레이아웃시프트를 방지하기 위해 페이지네이션 각 li를 div에 넣고 스타일을 고정합니다.
	const div = document.createElement('div');
	div.style.display = "flex";
	div.style.flexDirection = 'row';
	div.style.gap = '1.6rem';
	div.innerHTML = result;

	// #category nav ul 에 적용합니다.
	pageUl.insertAdjacentElement('beforeend', before);
	pageUl.insertAdjacentElement('beforeend', div);
	pageUl.insertAdjacentElement('beforeend', next);
}

// > 누를때 마다 계속 fetch 수행, < 한번이라도 중간에 눌렀으면 fetch수행 안함
const fetchNextPages = async () => {
	const baseUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US';

	// fetch 시 마다 5개의 프로미즈를 배열에 담을 것입니다. 페이지네이션이 5 증가할 때 마다 for 조건이 바뀌어야 해서 +5 해줍니다.
	const nextNum = cumulativeNum + 5;
	// promise 5개를 담을 배열입니다.
	const fetchPromises = [];

	// 누적숫자 부터 시작하여 +5 까지 반복합니다.
	for (let page = cumulativeNum; page < nextNum; page++) {
		const promise = fetch(`${baseUrl}&page=${page}`, options)
			.then(response => {
				// 그럴일은 아마도 없겠지만... 전체 영화 목록에서 마지막까지 간다면, 5로 딱 안떨어질 경우에 대비해보려고 했습니다.. promise 가 없다면 null을 저장합니다.
				if(response !== null && response !== undefined){
					return response.json();
				}else{
					return null;
				}
			});

		// null 이 반환되었다면 배열에 push 하지 않습니다.
		if(promise !== null && promise !== undefined) fetchPromises.push(promise);
	}

	// 페이지네이션에 사용할 번호 배열을 생성하고 전체 페이지네이션 배열에 push 합니다.
	const currPageNumbers = Array.from({ length: fetchPromises.length }, (_, i) => i + cumulativeNum);
	pagination.push(currPageNumbers);

	// 모든 작업이 끝났으므로 누적번호를 + 5한 값으로 저장합니다.
	cumulativeNum = nextNum;

	try {
		// 모든 페이지 요청을 promise.all 로 await 합니다.
		const results = await Promise.all(fetchPromises);
		
		// 총 페이지 수를 전역 변수에 저장합니다.
		total_pages = results[0].total_pages;
		total_results = results[0].total_results;

		// 모든 결과에서 영화 데이터만 추출하여 하나의 배열로 결합합니다.
		const allMovies = results.map(result => result.results);

		// 결합된 배열을 평점순 정렬합니다.
		allMovies.forEach(e => e.sort((a, b) => b.vote_average - a.vote_average));

		// accMovies 누적 영화 배열에 ... 으로 풀어서 push 합니다.
		accMovies.push(...allMovies);

		return allMovies;

	} catch (error) {
		console.error('Error fetching pages:', error);
		return [];  // 에러 발생 시 빈 배열 반환
	}
};

// 페이지네이션 아래 붉은 라인 클릭한 항목에 맞게 class on 부여
const redLineControl = (number = null) => {
	const redLine = document.querySelectorAll(".red-line>ul>li");
	// 그냥 on 을 모두 제거하고
	redLine.forEach(e => e.classList.remove('on'));
	// 최초혹은 페이지네이션 넘겼을 경우
	if(number === 0){
		redLine[0].classList.add("on");
	// 파라미터가 없지 않다면 on을 부여합니다. 
	}else if(number !== null){
		redLine[number].classList.add('on');
	}
}

// 페이지네이션 클릭시 발동
const handlePagination = async (event) => {
	// 주변 클릭시 에러 나는것 방지합니다.
	if(event.target.tagName === "DIV" || event.target.tagName === "UL") return;

	const currSelectedClassList = event.target.classList.value;
	const redLineId = event.target.id;

	// 이전 < 클릭시
	if(currSelectedClassList === 'before'){
		// data-pointer 의 값을 가져와서 number로 변환합니다.
		const dataSet = Number(event.target.dataset.pointer);
		// 이전으로 갈수 없다면 
		if(dataSet === -1){
			return;
		}else{
			// 페이지네이션 배열에 해당하는 값을 넘겨줍니다.
			makePagination(pagination[dataSet], dataSet);
			// 하단 붉은 라인 변경 함수 호출
			redLineControl(0);
			cancelAnimationFrame(animationFrameId);

			currPagination = currPagination - 5;

			// 상단 비쥬얼 부분을 바꿔줍니다
			const currPageData = changeTopVisual(accMovies[currPagination]);
			renderCardUi(currPageData);
			redLineControl(0);
		}
		// 이전을 클릭했으므로 fetch 방지용 변수에 before 를 할당합니다.
		beforeNextFlag = 'before';
	// 다음 > 클릭시
	}else if(currSelectedClassList === 'next'){
		const dataSet = Number(event.target.dataset.pointer);

		if(dataSet > pagination.length){
			return;
		// 이전으로를 클릭한 바로 뒤라면 다시 fetch를 하지 않습니다.
		}else if(beforeNextFlag === 'before'){
			cancelAnimationFrame(animationFrameId);

			makePagination(pagination[dataSet], dataSet);

			currPagination = currPagination + 5;

			redLineControl(0);
			const currPageData = changeTopVisual(accMovies[currPagination]);
			renderCardUi(currPageData);
		}else {

			const data = await fetchNextPages();

			currPagination = accMovies.length - data.length;

			// 6번이상으로 넘어가면 일단 정지 타이머도 적용 안합니다..
			// 그리고 캐러셀 <> 버튼과 유튜브 버튼도 일단 숨깁니다.
			// carouselBefore.style.visibility = "hidden";
			// carouselNext.style.visibility = "hidden";
			btnContent.parentElement.style.visibility = "hidden";

			redLineControl(0);
			const currPageData = changeTopVisual(accMovies[currPagination]);
			renderCardUi(currPageData);

			cancelAnimationFrame(animationFrameId);

			// next > 클릭 일때만 fetch 를 수행합니다.
			makePagination(pagination[dataSet], dataSet);

		}
		// 다음을 클릭했으므로 
		beforeNextFlag = 'next';
	// 페이지네이션 번호 클릭시 
	}else{			
		selectedPageNum = currSelectedClassList - 1;
		cancelAnimationFrame(animationFrameId);

		// 상단 비쥬얼 부분을 바꿔줍니다
		const currPageData = changeTopVisual(accMovies[selectedPageNum]);
		renderCardUi(currPageData);
		redLineControl(redLineId);
	}
}

// 유튜브 버튼을 인덱스 5이상이면 숨기고, 아니면 나타나게 하는 함수
const hideOrRevealYoutubeButton = (idx) => {
	if(idx >= 5) {
		btnContent.parentElement.style.visibility = "hidden";
	}else{
		btnContent.parentElement.style.visibility = "visible";
	}
}

// 배열 내부 배열의 length를 모두 더하기 
const sumAllData = (data) => {
	const reduced = data.reduce((acc, curr) => acc + curr.length, 0);
	return reduced;
}

// 캐러셀 자동 넘어가기 request animation frame 사용하여 개선
const carouselAnimate = (timestamp) => {
	// timestamp 는 rAF가 넘겨주는 경과된 시간(밀리초)
	// 만약 lastTime 이 null 또는 undefined 면 lastTime 을 rAF 가 시작된 시점의 timestamp와 일치시킴
    if (!lastTime) lastTime = timestamp;
	// 경과 시간을 측정 
    const elapsed = timestamp - lastTime;

	// 경과 시간이 인터벌 변수 값(3.5초) 보다 크면(지났으면)
    if (elapsed > interval) { 
		// 현재 누적된 모든 영화의 수 구하기
		// 모듈로 연산 : 먼저 다음으로 넘어가기 위해 1을 더하고, sum으로 나머지 연산 하여 0이 되면 다시 돌아감
        currCarouselIndex = (currCarouselIndex + 1) % 20;
		// 유튜브버튼 인덱스 5이상이면 숨기기
		hideOrRevealYoutubeButton(currCarouselIndex);
		// 상단 섹션 다시 그리기
        changeTopVisual(accMovies[0][currCarouselIndex]);
		// 유튜브 버튼에 아이디를 현재 카루셀 인덱스로 부여
        btnContent.id = currCarouselIndex;
		// cancel 될 때를 대비하여 다음 간격의 기준점을 설정???
        lastTime = timestamp;
    }

    animationFrameId = requestAnimationFrame(carouselAnimate);
}

// 상단 캐러셀 좌우 버튼 클릭시
const handleCarousel = (e) => {
	const to = e.target.innerText;
	const now = Date.now();

	// 이전 클릭으로부터의 시간 차이 계산
    const timeSinceLastClick = now - lastClickTime;

	console.log(timeSinceLastClick)

	// 인터벌 제거(자동 넘기기 제거)
	cancelAnimationFrame(animationFrameId);

	// 이전이면
	if(to === 'navigate_before'){
		// 현재 인덱스 감소, 순환구조
		currCarouselIndex = (currCarouselIndex - 1 + 20) % 20;
		hideOrRevealYoutubeButton(currCarouselIndex);
		// 상단 비쥬얼 부분 바꾸기
		changeTopVisual(accMovies[currCarouselIndex === 0 && carouselIndexControl > 0 ? carouselIndexControl -= 1 : carouselIndexControl][currCarouselIndex]);
		// 유튜브 버튼을 위해 id 할당
		btnContent.id = currCarouselIndex;
		// 인터벌 재시작
		if(timeSinceLastClick > 3000) setTimeout(() => requestAnimationFrame(carouselAnimate), 5000);
		// 마지막 클릭 시간 업데이트
		lastClickTime = now;
	// 다음이면
	}else if(to === 'navigate_next'){
		currCarouselIndex = (currCarouselIndex + 1) % 20;
		hideOrRevealYoutubeButton(currCarouselIndex);
		if(carouselIndexControl >= accMovies.length) carouselIndexControl = 0;
		changeTopVisual(accMovies[currCarouselIndex === 19 ? carouselIndexControl += 1 : carouselIndexControl][currCarouselIndex]);
		btnContent.id = currCarouselIndex;
		// 인터벌 재시작
		if(timeSinceLastClick > 3000) setTimeout(() => requestAnimationFrame(carouselAnimate), 5000);
		// 마지막 클릭 시간 업데이트
		lastClickTime = now;
	}
	
}

// 유튜브 버튼 클릭시 
const handleYoutubeClick = () => {
	// 인터벌 정지
	cancelAnimationFrame(animationFrameId);

	// 유튜브 버튼 id 값을 변수에 저장
	const id = Number(btnContent.id);

	if (typeof id === 'number') {
		// const id = closestLiWithClassOn.id;
		videoContainer.style.display = "block";
		iframe.src = "";
		iframe.src = videoSrc[id];
	} else {
		alert("영상을 찾아볼 수 없습니다.");
	}

	document.querySelector(".closevideo").addEventListener("click", () => {
		videoContainer.style.display = "none"; //영상을 감싼 div숨기기
		iframe.src = "";
		// 유튜브 영상 종료시 인터벌 재개
		setTimeout(() => requestAnimationFrame(carouselAnimate), 5000);
	});
}

/** ========================== init ============================== */
const init = async () => {
	searchInput.focus(); //페이지 로딩되면 검색란에 포커스되게 하기

	// 우측 메뉴 모달 부착
	menuModal();
	
	// 최초 fetch
	await fetchNextPages();
	// 최초 페이지네이션 생성
	makePagination(pagination[0], 0);

	// 최초 하단 붉은 라인 생성
	for (let i = 0; i < 5; i++) {
		const redLine = document.createElement('li');
		redLine.setAttribute('id', i + 1);
		const underRedLine = document.querySelector(".red-line>ul");
		underRedLine.append(redLine);
	}

	// 붉은 라인이 1번에 최초 설정되도록
	redLineControl(0);

	// 상단 비쥬얼부분 최초 적용
	changeTopVisual(accMovies[0]);

	// 캐러셀 인터벌 시작
	requestAnimationFrame(carouselAnimate);
	
	// 카드 부착
	renderCardUi(accMovies[0].slice(0, 4));

	// 카드 클릭시 디테일로 이동
	movieArrUL.addEventListener("click", handleCardClick);

	// youtube 버튼 핸들링
	btnContent.addEventListener("click", handleYoutubeClick);

	// carousel 버튼 핸들링
	carouselBefore.addEventListener('click', handleCarousel);
	carouselNext.addEventListener('click', handleCarousel);

	// 영화 검색창 포커스하면 빨간색 밑줄 생김 아닐때 없어짐
	// 마우스커서가 검색창 포커스되면~
	searchInput.addEventListener("focus", () => searchLine.classList.add("on"));

	// 마우스커서가 검색창 포커스안되면~
	searchInput.addEventListener("blur", () => searchLine.classList.remove("on"));
		
	//불필요하게 메모리점용으로 위 코드를 아래코드로 업데이트함
	pageUl.addEventListener("click", handlePagination);

	// 더보기 버튼 클릭시
	showMoreBtn.addEventListener("click", handleShowMore);

	// 아이콘 눌러서 검색할 때
	searchIcon.addEventListener("click", handleSearch);
	
	// 엔터키로 검색할 떄
	searchInput.addEventListener("keypress", (e) => e.keyCode === 13 && searchIcon.click());
}

// init!
document.addEventListener("DOMContentLoaded", init);


// 캐러셀 자동 넘어가기 
// const carouselInterval = (curr = null) => {
// 	// 파라미터로 받은 값이 있다면 해당 값으로 counter 변수를 설정합니다.
// 	let counter = curr !== null ? curr : 0;
// 	currCarouselIndex = counter;

// 	// 3.5초마다 발동
// 	intervalNum = setInterval(() => {
// 		// 유튜브 재생을 위해 유튜브 버튼의 id 를 변경시킵니다.
// 		btnContent.id = counter;
// 		// 상단 비쥬얼 부분을 바꿔줍니다.
// 		changeTopVisual(accMovies[0][counter]);
// 		// 여기는 일단 5개만 캐러셀 돌게 하려고 4보다 작을때만 증가시키도록 했습니다.
// 		counter < 4 ? counter ++ : counter = 0;
// 		// 전역변수와 내부변수 counter 일치 시켜줍니다.
// 		currCarouselIndex = counter;
// 	}, 3500); 
// }