//비쥬얼에 나오는 영화의 제목 위치
const visualTitle = document.querySelector("#visual .content .intro .title");
//비쥬얼에 나오는 영화의 소개 위치
const movieContent = document.querySelector("#visual .content .intro .movie-content");
//비쥬얼에 나오는 영화의 포스터 위치
const poster = document.querySelector("#visual .content .poster"); //평점높은 영화를 비주얼에 배치
const visual = document.querySelector("#visual"); //비쥬얼 배경화면을 변경하기위해 찾음
const videoContainer = document.getElementById("videoContainer"); //여기는 트레일러영상을 담은 박스임
const iframe = document.querySelector("iframe");
const btnContent = document.querySelector(".btn-content");
const searchIcon = document.querySelector(".search-icon"); //검색 버튼임
const searchInput = document.querySelector("#search-movie"); //검색창을 선택한거임
const searchOption = document.getElementById("search-option"); //검색옵션 선택임
const showMoreBtn = document.querySelector(".show-more");
const pageUl = document.querySelector("#category>nav>ul");
let selectedPageNum = 0;
let cumulativeNum = 1;
let total_pages = 0;
let total_results = 0;
let accMovies = [];
let pagination = [];
let beforeNextFlag = '';

// fetch options
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2Q0ZmVkNjFhOWJlYzIwMzMzOGM4ZDQ0YjI4N2Q4OSIsInN1YiI6IjY2Mjg3NTc2MTc2YTk0MDE2NjgyMDlkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o_kqyGpLPOWQA3Ye2wXP63XwItH3ceGKBySBV7CtrRs"
	}
};

const videoSrc = [
	"https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn", //1번영상
	"https://www.youtube.com/embed/R8KZ9WOTU78?si=NIczp7MdTaEzFYAa", //2번영상
	"https://www.youtube.com/embed/KudedLV0tP0?si=F5iM5PTGhi3158gz", //3번영상
	"https://www.youtube.com/embed/_dY0SVxnHjQ?si=gZGj8Gb4I4FmIoNb", //4번영상
	"https://www.youtube.com/embed/sw07I2OH4Ho?si=i219LhEgp47J531H`", //5번영상
	"https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn" //6번영상
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

// 영화 개별 카드 생성용
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

// 유튜브 버튼 클릭시 
const handleYoutubeClick = () => {
	const closestLiWithClassOn = document.querySelector(".red-line ul .on");
	//.red-line ul 하위요소중 제일 가까운 li를 찾아
	// class on이 붙어있는 li를 또 찾아 그의 id를반환한다.
	if (closestLiWithClassOn) {
		const id = closestLiWithClassOn.id;
		videoContainer.style.display = "block";
		iframe.src = "";
		iframe.src = videoSrc[id - 1];
	} else {
		alert("영상을 찾아볼 수 없습니다.");
	}

	document.querySelector(".closevideo").addEventListener("click", () => {
		videoContainer.style.display = "none"; //영상을 감싼 div숨기기
		iframe.src = "";
	});
}

// 검색어 가공
const searchKeyword = (item) => {
	// if(searchOption) return;
	const mySelect = searchOption.value;
	if (mySelect === "제목") {
		return item.toString().toLowerCase();
	} else if (mySelect === "평점") {
		return parseFloat(item);
	}
}

//페이지마다 다른 영화내용을 추가함
const renderCardUi = (movieData) => {
	const movieArrUL = document.querySelector("#movie-array ul");
	if (typeof movieData === "object") {
		movieArrUL.innerHTML = "";
		movieData.forEach((item, i) => {
			//순서대로 하나하나씩 배치해라!
			let template = `
				<li class='${movieData[i].id}'>
					<div class="movie-poster">
						<img src="https://image.tmdb.org/t/p/w500${movieData[i].poster_path}" alt="${movieData[i].id}">
					</div>
					<div class="title">
						<p>${movieData[i].original_title}</p>
						<p>평점 : ${movieData[i].vote_average}</p>
					</div>
				</li>`;
				movieArrUL.insertAdjacentHTML("beforeend", template);

			const liList = document.querySelectorAll("#movie-array ul li");

			//한줄에 4개의 li를 배치 하기위해 css에 부여된 margin-right를 없애기
			for (let i = 3; i < liList.length; i += 4) {
				liList[i].style.marginRight = "0px";
			}
		});
	} else {
		movieArrUL.innerHTML = "";
		movieArrUL.innerHTML = `<h3 style="color:#fff;font-size:40px;">${movieData}</h3>`;
	}

	movieArrUL.addEventListener("click", (e) => {
		const clickedCard = e.target;
		if (e.target.matches("#movie-array ul")) {
			return;
		}
		const movieModalData = movieData.filter((item) => {
			return item.id == clickedCard.closest("li").classList.value;
		});
		cardModal(...movieModalData);
		document.getElementById("movie-modal").style.top = "0px";
	});
};

// 페이지네이션 바뀔 때마다 상단부분(비쥬얼부분) 바꾸고(평점높은 영화로), 파라미터로 받은 데이터 배열 그대로 반환
const cardUi = (data) => {
	// 평점이 가장 높은 영화 선택
	const topMovie = data[0];

	visualTitle.textContent = topMovie.original_title; //비주얼 영화제목을 평점높은영화거로
	movieContent.textContent = topMovie.overview; //위에 하는 작업과 동일한데 영화 줄거리가져옴
	poster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" alt="${topMovie.id}">`; //비쥬얼 포스트를 평점높은 영화걸로 바꿈
	visual.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${topMovie.backdrop_path}')`; //여기는 배경화면을 바꿈

	return data;
};

// 페이지네이션, 처음에 한번 호출되고 < > 클릭으로 페이지네이션 바뀔때마다 호출
const makePagination = (paginationArr, pageNum) => {
	pageUl.innerHTML = '';

	let beforePointer = pageNum - 1;
	let nextPointer = pageNum + 1;

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

	const result = paginationArr.map((e, i) => {
		const temp = `<li class=${e} id=${i}>${e}</li>`;
		return temp
	}).join('');

	const div = document.createElement('div');
	div.style.display = "flex";
	div.style.flexDirection = 'row';
	div.style.gap = '1.6rem';
	// div.style.width = '160px';

	div.innerHTML = result;

	pageUl.insertAdjacentElement('beforeend', before);
	pageUl.insertAdjacentElement('beforeend', div);
	pageUl.insertAdjacentElement('beforeend', next);
}

// > 누를때 마다 계속 fetch 수행, < 한번이라도 중간에 눌렀으면 fetch수행 안함
const fetchNextPages = async () => {
	const baseUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US';

	const nextNum = cumulativeNum + 5;
	const fetchPromises = [];

	for (let page = cumulativeNum; page < nextNum; page++) {
		const promise = fetch(`${baseUrl}&page=${page}`, options)
			.then(response => {
				if(response !== null && response !== undefined){
					return response.json();
				}else{
					return null;
				}
			});

		if(promise !== null && promise !== undefined) fetchPromises.push(promise);
	}

	// 페이지네이션에 사용할 번호 배열 생성
	const currPageNumbers = Array.from({ length: fetchPromises.length }, (_, i) => i + cumulativeNum);
	pagination.push(currPageNumbers);

	try {
		  // 모든 페이지 요청을 promise.all 로
		const results = await Promise.all(fetchPromises);
		
		total_pages = results[0].total_pages;
		total_results = results[0].total_results;

		  // 모든 결과에서 영화 데이터를 추출하여 하나의 배열로 결합
		const allMovies = results.map(result => result.results);

		allMovies.forEach(e => e.sort((a, b) => b.vote_average - a.vote_average));

		accMovies.push(...allMovies);

		cumulativeNum = nextNum;

		return allMovies;

	} catch (error) {
		console.error('Error fetching pages:', error);
		return [];  // 에러 발생 시 빈 배열 반환
	}
};

// 페이지네이션 아래 붉은 라인 클릭한 항목에 맞게 class on 부여
const redLineControl = (number = null) => {
	const redLine = document.querySelectorAll(".red-line>ul>li");
	redLine.forEach(e => e.classList.remove('on'));
	if(number === 0){
		redLine[0].classList.add("on");
	}else if(number !== null){
		redLine[number].classList.add('on');
	}
}


/** ========================== init ============================== */

const init = async () => {
	searchInput.focus(); //페이지 로딩되면 검색란에 포커스되게 하기

	// youtube 버튼 핸들링
	btnContent.addEventListener("click", handleYoutubeClick);

	// 우측 메뉴 모달 부착
	menuModal();
	
	await fetchNextPages();
	makePagination(pagination[0], 0);

	for (let i = 0; i < 5; i++) {
		const redLine = document.createElement('li');
		redLine.setAttribute('id', i + 1);
		const underRedLine = document.querySelector(".red-line>ul");
		underRedLine.append(redLine);
	}

	redLineControl(0);
	

	//첫화면 로드 시 보이는 영화카드들
	//allMovie.slice(0, 20) 성능개선하기위해 page['1']을 택함 slice는 새로운배열생성하니까 메모리 더 많이 차지함
	cardUi(accMovies[0]);
	renderCardUi(accMovies[0].slice(0, 4));

	// 페이지네이션 클릭하면
	pageUl.addEventListener("click", async (event) => {

		if(event.target.tagName === "DIV" || event.target.tagName === "UL") return;

		const currSelectedClassList = event.target.classList.value;
		const redLineId = event.target.id;

		if(currSelectedClassList === 'before'){
			const dataSet = Number(event.target.dataset.pointer);
			if(dataSet === -1){
				return;
			}else{
				makePagination(pagination[dataSet], dataSet)
			}
			redLineControl();
			beforeNextFlag = 'before';
		}else if(currSelectedClassList === 'next'){
			const dataSet = Number(event.target.dataset.pointer);

			if(dataSet > pagination.length){
				return;
			}else if(beforeNextFlag === 'before'){
				makePagination(pagination[dataSet], dataSet);
			}else {
				await fetchNextPages();
				makePagination(pagination[dataSet], dataSet);
			}
			redLineControl();
			beforeNextFlag = 'next';
		}else{			
			selectedPageNum = currSelectedClassList - 1;

			const currPageData = cardUi(accMovies[selectedPageNum]);
			renderCardUi(currPageData);
			redLineControl(redLineId);
		}
	});


	// 영화 검색창 포커스하면 빨간색 밑줄 생김 아닐때 없어짐
	// 마우스커서가 검색창 포커스되면~
	searchInput.addEventListener("focus", () => document.querySelector(".search-line").classList.add("on"));

	// 마우스커서가 검색창 포커스안되면~
	searchInput.addEventListener("blur", () => document.querySelector(".search-line").classList.remove("on"));
		
	//불필요하게 메모리점용으로 위 코드를 아래코드로 업데이트함
	pageUl.addEventListener("click", (event) => {
		
	});

	// 더보기 버튼 클릭시
	showMoreBtn.addEventListener("click", () => {
		searchInput.focus();
		const data = cardUi(accMovies[selectedPageNum]);
		renderCardUi(data);
	});

	// 아이콘 눌러서 검색할 때
	searchIcon.addEventListener("click", () => {
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
	});
	
	// 엔터키로 검색할 떄
	searchInput.addEventListener("keypress", (e) => {
		if (e.keyCode === 13) {
			searchIcon.click();
		}
	});
}

document.addEventListener("DOMContentLoaded", init);