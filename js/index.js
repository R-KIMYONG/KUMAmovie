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

    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-line').classList.add('on')
    })
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-line').classList.remove('on')
    })


}

category()


// 영화정보 API

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2Q0ZmVkNjFhOWJlYzIwMzMzOGM4ZDQ0YjI4N2Q4OSIsInN1YiI6IjY2Mjg3NTc2MTc2YTk0MDE2NjgyMDlkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o_kqyGpLPOWQA3Ye2wXP63XwItH3ceGKBySBV7CtrRs'
    }
};

document.addEventListener('DOMContentLoaded', () => { //HTML 로딩되면 API받아온다.


    let cardUi = function (data) {

        // console.log(data.sort())

        //menu 모달 in out
        function menuModal() {
            let modal = document.querySelector('#menu-modal')//모달을 찾음
            let menuBtn = document.querySelector('#menu') //메뉴버튼을 찾음
            let closeBtn = document.querySelector('#close-modal')//닫기 버튼을 찾음
            menuBtn.addEventListener('click', () => {
                modal.style.right = '0px'
            })
            closeBtn.addEventListener('click', () => {
                modal.style.right = '-350px'
            })


        }

        menuModal()

        let visual = () => {
            // 평점 기준으로 영화 데이터 정렬
            data.sort((a, b) => b.vote_average - a.vote_average);
            // 평점이 가장 높은 영화 선택

            let topMovie = data[0];
            //비쥬얼에 나오는 영화의 제목 위치
            let visualTitle = document.querySelector('#visual .content .intro .title')
            //비쥬얼에 나오는 영화의 소개 위치
            let movieContent = document.querySelector('#visual .content .intro .movie-content')
            //비쥬얼에 나오는 영화의 포스터의 위치
            let poster = document.querySelector('#visual .content .poster')
            let visual = document.querySelector('#visual')
            let videoContainer = document.getElementById("videoContainer");
            let videoList = document.querySelectorAll('#videoContainer ul li')
            let page = document.querySelectorAll('.red-line ul li')
            page.forEach((item, index) => {
                if (item.classList.contains('on')) {
                    document.querySelector('.traller-btn').addEventListener('click', () => {
                        videoContainer.style.display = "block";

                        videoList.forEach((item) => {
                            item.style.display = "none"
                        })

                        videoList[index].style.display = 'block'

                    })
                    //트레일러 종료
                    videoContainer.addEventListener('click', () => {

                        videoContainer.style.display = "none";
                        videoList.forEach((item) => {
                            item.style.display = "none"
                        })

                    })
                }


            })
            // console.log(page[0])



            visualTitle.textContent = topMovie.original_title
            movieContent.textContent = topMovie.overview
            // poster.innerHTML=''
            poster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${topMovie.poster_path}" alt="${topMovie.id}">`
            visual.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${topMovie.backdrop_path}')`

        }
        visual()




        //show more버튼 클릭하면 .slice(0,4씩올라가야한다)
        let showMore = () => {
            let num = 4
            let showmoreBtn = document.querySelector('.show-more')
            let showCard = () => {
                if (num < data.length) { //4개씩 보여달라!
                    num += 4
                    // data = response.results.slice(0, num)
                    rerenderCardui(data.slice(0, num));
                    if (num === data.length) {
                        showmoreBtn.removeEventListener("click", showCard)
                        document.querySelector('.show-more p').textContent = "NO MORE"
                    }
                }
                return data
            }
            showmoreBtn.addEventListener('click', showCard)
        }
        showMore()

        let searchMovie = function () {
            let searchIcon = document.querySelector('.search-icon')
            let searchInput = document.querySelector('#search-movie')
            searchIcon.addEventListener('click', () => {
                let searchKeyword = searchInput.value.toLowerCase();
                let newarr = []
                for (let i = 0; i < data.length; i++) {
                    let movieTitle = data[i].original_title.toLowerCase()

                    //만약에 영화제목이 검색키워드랑 같기도하고 검색키워드가 빈칸아니기도하고 검색키워드가 문자열이면 참이다.
                    //&& searchKeyword != '' && typeof searchKeyword === 'string'
                    if (movieTitle.includes(searchKeyword)) {
                        newarr.push(data[i])
                    }
                }
                if (newarr.length !== 0) {
                    rerenderCardui(newarr)
                } else {
                    rerenderCardui('검색결과가 없습니다.')
                }
            })

        }
        searchMovie()

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




            function cardModal(item) {
                let templet = `<div class="movie-poster">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}">
                </div>
                <div class="title">
                    <p>영화 id : ${item.id}</p>
                    <p>${item.original_title}</p>
                    <p>평점 : ${item.vote_average}</p>
                    <p>줄거리 : ${item.overview}</p>
                </div>
                <div class='movie-modal-close'>
                    <h3>닫기</h3>
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </div>`;
                document.getElementById('movie-modal').innerHTML = templet; // 기존 내용 제거 후 새로운 내용 삽입
                document.querySelector('.movie-modal-close').addEventListener('click',()=>{
                    document.getElementById('movie-modal').style.top='-850px'
                })
            }
            
            document.querySelectorAll('#movie-array ul li').forEach((item,index) => {
                item.addEventListener("click", (e) => {
                    document.getElementById('movie-modal').style.top='0px'
                    // 클릭된 li 요소의 데이터를 얻기 위해 클릭 이벤트 리스너에서 cardModal() 함수 호출
                    cardModal(movieData[index]); // 클릭된 요소의 데이터를 전달하여 모달에 보여주기
                });
            });







        }
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
                let sortData = response.results.sort((a, b) => { return a.id - b.id })
                pageDataMap.set(page, sortData);
            })
            .catch(error => console.error('Error:', error));

        // 생성된 프로미스를 배열에 추가
        allPromises.push(promise);
    }

    // 모든 페이지의 데이터를 받아온 후에 실행되는 코드 (allPromises는 기다릴데이터임 5페이지니 다완료되면 밑에 코드 실행해줌)
    Promise.all(allPromises).then(() => {
        // 페이지 데이터를 활용하여 원하는 작업 수행
        let page = Object.fromEntries(pageDataMap.entries());
        let totalPage = Object.keys(page).length
        // console.log(page[1])//각 페이지의 데이터 나옴
        let allMovie = [] //전체 영화의 데이터임
        for (let i = 1; i <= totalPage; i++) {
            allMovie.push(...page[`${i}`])
        }
        cardUi(allMovie)
        let category = document.querySelectorAll('#category>nav>ul>li')

        for (let i = 0; i < category.length; i++) {
            category[i].addEventListener("click", (e) => {
                if (i == 0) {
                    cardUi(allMovie)
                    // console.log(1)//test
                } else {
                    cardUi(page[i])
                    // console.log(2)//test
                }
            });
        }
    });
});

