function category() {
    //1. #category>nav>ul>li를 호버하면
    //2. .red-line>ul>li가 100px로된다.
    let categoryList = document.querySelectorAll('#category nav ul li');
    let categoryUnderline = document.querySelectorAll('.red-line ul li');

    categoryList.forEach((item, index) => {
        item.addEventListener('click', () => {
            let under = document.querySelectorAll('.red-line ul li')[index]
            categoryUnderline.forEach((el) => {
                el.classList.remove('on');
                under.classList.add('on');
            });
        });
    });

    // 영화 검색창 포커스하면 빨간색 밑줄 생김 아닐때 없어짐
    let searchInput = document.getElementById('search-movie');
    //마우스커서가 검색창 포커스되면~
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-line').classList.add('on')
    })
    //마우스커서가 검색창 포커스안되면~
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-line').classList.remove('on')
    })
};
category();

// 영화정보 API

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2Q0ZmVkNjFhOWJlYzIwMzMzOGM4ZDQ0YjI4N2Q4OSIsInN1YiI6IjY2Mjg3NTc2MTc2YTk0MDE2NjgyMDlkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o_kqyGpLPOWQA3Ye2wXP63XwItH3ceGKBySBV7CtrRs'
    }
};

document.addEventListener('DOMContentLoaded', () => { //HTML 로딩되면 API받아온다.

    let serchInput = document.querySelector('#search-movie'); //검색 인풋을 찾아
    serchInput.focus(); //페이지 로딩되면 검색란에 포커스되게 하기

    let cardUi = function (data) {

        //menu 모달 in out
        let menuModal = () => {
            let modal = document.querySelector('#menu-modal')//모달을 찾음
            let menuBtn = document.querySelector('#menu') //메뉴버튼을 찾음
            let closeBtn = document.querySelector('#close-modal')//닫기 버튼을 찾음
            menuBtn.addEventListener('click', () => {
                modal.style.right = '0px'
            })
            closeBtn.addEventListener('click', () => {
                modal.style.right = '-350px'
            })


        };
        menuModal();

        //visual에 트레일러버튼 클릭 시 나타나는 모달기능과 각API정보를 UI에 할당함
        let visual = () => {
            // 평점 기준으로 영화 데이터 정렬
            // console.log(data.sort((a, b) => b.vote_average - a.vote_average))
            // 평점이 가장 높은 영화 선택
            let topMovie = data[0];
            //비쥬얼에 나오는 영화의 제목 위치
            let visualTitle = document.querySelector('#visual .content .intro .title');
            //비쥬얼에 나오는 영화의 소개 위치
            let movieContent = document.querySelector('#visual .content .intro .movie-content');
            //비쥬얼에 나오는 영화의 포스터 위치
            let poster = document.querySelector('#visual .content .poster'); //평점높은 영화를 비주얼에 배치
            let visual = document.querySelector('#visual')//비쥬얼 배경화면을 변경하기위해 찾음
            let videoContainer = document.getElementById("videoContainer");//여기는 트레일러영상을 담은 박스임
            let page = document.querySelectorAll('.red-line ul li');//page수를 다 찾음

            // let videoSrc = ['https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn', //1번영상
            //     'https://www.youtube.com/embed/L4DvL0UBZPQ?si=qg6Id5dQpIhOmFDo',//2번영상
            //     'https://www.youtube.com/embed/8cQH4CELCSw?si=y1o3IkhMhK10VkVl',//3번영상
            //     'https://www.youtube.com/embed/ye4KFyWu2do?si=jSXdLrCKgU2sffZk',//4번영상
            //     'https://www.youtube.com/embed/z_tgY9Nmo18?si=wBFNMYrdRMISgKfC',//5번영상
            //     'https://www.youtube.com/embed/PLl99DlL6b4?si=Tm0yn-2_WldvhrTn'];//6번영상
            let iframe = document.querySelector('iframe')

            page.forEach((item, index) => {
                if (item.classList.contains('on')) {
                    document.querySelector('.traller-btn').addEventListener('click', () => {
                        videoContainer.style.display = "block";
                        // iframe.src = videoSrc[index]
                        searchTrailer();
                    });
                    //트레일러 영상 끄기 버튼
                    document.querySelector('.closevideo').addEventListener('click', () => {
                        videoContainer.style.display = "none"; //영상을 감싼 div숨기기
                        iframe.src = ''
                    });
                };
            });
            visualTitle.textContent = topMovie.original_title; //비주얼 영화제목을 평점높은영화거로
            movieContent.textContent = topMovie.overview; //위에 하는 작업과 동일한데 영화 줄거리가져옴
            // poster.innerHTML=''
            poster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" alt="${topMovie.id}">` //비쥬얼 포스트를 평점높은 영화걸로 바꿈
            visual.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${topMovie.backdrop_path}')`; //여기는 배경화면을 바꿈



            const apiKey = 'AIzaSyCedUvtVcmBnLuEPua10hM9bCrlRp2Pkhg'
            const movieTitle = topMovie.original_title
            const query = encodeURIComponent(movieTitle + ' official trailer');

            // 검색 요청을 보내고 트레일러 영상을 가져오는 함수
            let searchTrailer = async () => {
                // 검색 API 엔드포인트
                const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}`;

                // API 요청 보내기
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // 검색 결과에서 첫 번째 영상의 ID 추출
                        const videoId = data.items[0].id.videoId;
                        // iframe을 생성하여 해당 영상을 재생
                        playTrailer(videoId);
                    })
                    .catch(error => {
                        console.error('유튜브 검색 요청 실패:', error);
                    });
            }

            // 트레일러 영상을 재생하는 함수
            function playTrailer(videoId) {
                const iframe = document.querySelector('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.title = 'YouTube video player';
                iframe.allowFullscreen = true;
            }

            // 검색어를 이용하여 트레일러 검색 실행
            
        };
        visual();

        //show more버튼 클릭하면 .slice(0,4씩올라가야한다

        let showMore = () => {
            let showmoreBtn = document.querySelector('.show-more');

            showmoreBtn.addEventListener('click', () => {
                rerenderCardui(data)
                serchInput.focus();
            });
        };
        showMore();

        //영화검색기능 추가히기
        let searchMovie = () => {
            let searchIcon = document.querySelector('.search-icon');//검색 버튼임
            let searchInput = document.querySelector('#search-movie');//검색창을 선택한거임
            const searchOption = document.getElementById('search-option');//검색옵션 선택임

            function searchKeyword(item) {
                let myselect = searchOption.value;
                if (myselect === '제목') {
                    return item.toString().toLowerCase();
                } else if (myselect === '평점') {
                    return parseFloat(item);
                };
            };
            searchIcon.addEventListener('click', () => {
                let keyWord = searchKeyword(searchInput.value);//유저가 검색창에 입력한 검색어 (만약에 검색어 앞 또는 뒤에 빈칸이 있으면 없앤다)
                let newarr = [];
                if (typeof keyWord === 'string' && keyWord !== '') {
                    newarr = [...data].filter((item) => item.original_title.toLowerCase().includes(keyWord.trim()));
                } else if (typeof keyWord === 'number' && keyWord !== '') {
                    newarr = [...data].filter((item) => parseInt(item.vote_average) === keyWord);
                }
                if (newarr.length !== 0) {
                    rerenderCardui(newarr);
                } else {
                    rerenderCardui(`${searchOption.value} ${searchInput.value}에 대한 검색결과가 없습니다.😅`)
                }
            })
            searchInput.addEventListener('keypress', (e) => {
                if (e.keyCode === 13) {
                    searchIcon.click();
                };
            });

        };
        searchMovie();

        //페이지마다 다른 영화내용을 추가함
        function rerenderCardui(movieData) { // 카드UI를 다시 불러와라!

            // console.log(movieData)
            if (typeof movieData === 'object') {
                document.querySelector('#movie-array ul').innerHTML = ''
                movieData.forEach((item, i) => { //순서대로 하나하나씩 배치해라!
                    let templet = `<li>
                    <div class="movie-poster">
                        <img src="https://image.tmdb.org/t/p/w500${movieData[i].poster_path}" alt="${movieData[i].id}">
                    </div>
                    <div class="title">
                        <p>${movieData[i].original_title}</p>
                        <p>평점 : ${movieData[i].vote_average}</p>
                    </div>
                    </li>`
                    document.querySelector('#movie-array>ul').insertAdjacentHTML('beforeend', templet);
                    let liList = document.querySelectorAll('#movie-array ul li')

                    //한줄에 4개의 li를 배치 하기위해 css에 부여된 margin-right를 없애기
                    for (let i = 3; i < liList.length; i += 4) {
                        liList[i].style.marginRight = '0px'
                    }
                })
            } else {
                document.querySelector('#movie-array ul').innerHTML = ''
                document.querySelector('#movie-array ul').innerHTML = `<h3 style="color:#fff;font-size:40px;">${movieData}</h3>`
            }




            let cardModal = (item) => {
                let templet = `<div class="movie-poster">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}">
                </div>
                <div class="title">
                    <p>영화 id : ${item.id}</p>
                    <p>${item.original_title}</p>
                    <p>평점 : ${item.vote_average}점</p>
                    <p>요약 : ${item.overview}</p>
                </div>
                <div class='movie-modal-close'>
                    <h3>닫기</h3>
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </div>`;
                document.getElementById('movie-modal').innerHTML = templet; // 기존 내용 제거 후 새로운 내용 삽입
                document.querySelector('.movie-modal-close').addEventListener('click', () => {
                    document.getElementById('movie-modal').style.top = '-850px'
                });
            };

            document.querySelectorAll('#movie-array ul li').forEach((item, index) => {
                item.addEventListener("click", (e) => {
                    document.getElementById('movie-modal').style.top = '0px'
                    // 클릭된 li 요소의 데이터를 얻기 위해 클릭 이벤트 리스너에서 cardModal() 함수 호출
                    cardModal(movieData[index]); // 클릭된 요소의 데이터를 전달하여 모달에 보여주기
                });
            });

        };
        rerenderCardui(data.slice(0, 4));
    }
    //===========================

    let pageDataMap = new Map();
    let allPromises = [];
    // 페이지 요청을 위한 반복문
    for (let page = 1; page <= 5; page++) {
        // 각 페이지 요청에 대한 프로미스 생성
        let promise = fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
            .then(response => response.json())
            .then(response => {
                // 받아온 데이터를 Map에 페이지 번호를 키로 사용하여 저장
                pageDataMap.set(page, response.results);
            })
            .catch(error => console.error('Error:', error));

        // 총 5페이지의 영화 데이터이니까 하나하나 로드완료되면 promise로 던짐
        allPromises.push(promise);
    };

    // 모든 페이지의 데이터를 받아온 후에 실행되는 코드 (allPromises는 기다릴데이터임 5페이지니 다완료되면 밑에 코드 실행해줌)
    Promise.all(allPromises).then(() => {
        // 페이지 데이터를 활용하여 원하는 작업 수행
        let page = Object.fromEntries(pageDataMap.entries());//각페이지를 하나의 객체에 저장함(순환하기위해)
        let totalPage = Object.keys(page).length//페이지수를 얻을려고(코드 확장성위해)
        // console.log(page[1])//각 페이지의 데이터 나옴
        let allMovie = [] //전체 영화의 데이터임 
        for (let i = 1; i <= totalPage; i++) { //전체 영화 페이지위해 1~5페이지의 영화를 하나의 array에 저장함

            allMovie.push(...page[`${i}`].sort((a, b) => { return b.vote_average - a.vote_average })) //인기 영화순으로 배열에 저장함

        }
        cardUi(allMovie.slice(0, 20)) //첫페이지 로드 시 전체 영화를 로드함
        console.log()
        let category = document.querySelectorAll('#category>nav>ul>li')
        for (let i = 0; i < category.length; i++) { //페이지 수를 순환함
            category[i].addEventListener("click", (e) => {
                serchInput.focus()
                if (i === category.length - 1) {
                    cardUi(allMovie) //All클릭하면 다시 전체 영화 로드함
                } else {
                    cardUi(page[i + 1]) //다른페이지를 클릭하면 해당 페이지의 데이터만 출력
                    // console.log(2)//test
                }
            });
        }
    });
});

