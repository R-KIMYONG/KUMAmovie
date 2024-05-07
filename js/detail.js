//=================세영 start=====================
const API_KEY = "e4a84d9378c3db262d591cbe6cd51d64"; // 여기에 TMDB API 키를 입력하세요.
const MOVIE_ID = "372754"; //일단 고정된 아이디 추후 uml에서 가지고올 예정
const baseURL = "https://api.themoviedb.org/3";
const imageURL = "https://image.tmdb.org/t/p/original";

// 출연진 표시
async function fetchCast() {
	const url = `${baseURL}/movie/${MOVIE_ID}/credits?api_key=${API_KEY}`;
	const response = await fetch(url);
	const data = await response.json();
	const castList = document.getElementById("cast-list");

	data.cast.slice(0, 5).forEach((actor) => {
		// 상위 5명의 출연진만 표시
		const actorDiv = document.createElement("div");
		actorDiv.classList.add("actor");

		const actorImg = document.createElement("img");
		actorImg.src = `${imageURL}${actor.profile_path}`;
		actorImg.alt = `Image of ${actor.name}`;
		actorImg.onerror = () => {
			actorImg.src = "/img/DefaultProfile.png"; // 오류 발생 시 기본 프로필 이미지
		};

		const actorName = document.createElement("div");
		actorName.classList.add("actor-name");
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
	const existingPoster = document.querySelector("#movie-poster");
	if (existingPoster) {
		existingPoster.remove();
	}

	const rightSideElement = document.querySelector(".right_side");

	// 영화 포스터 설정
	if (detailsData.poster_path) {
		const posterURL = `${imageURL}${detailsData.poster_path}`;
		const posterImgElement = document.createElement("img");
		posterImgElement.src = posterURL;
		posterImgElement.alt = "Movie Poster";
		posterImgElement.id = "movie-poster";

		rightSideElement.appendChild(posterImgElement);

		// 영화 제목 추가
		const titleElement = document.createElement("div");
		titleElement.textContent = detailsData.title;
		titleElement.className = "movie-title";

		rightSideElement.appendChild(titleElement);
		// 영화 평점 추가
		const ratingElement = document.createElement("div");
		ratingElement.textContent = `평점: ${detailsData.vote_average} / 10`;
		ratingElement.className = "movie-rating";
		rightSideElement.appendChild(ratingElement);
	} else {
		console.log("적합한 포스터 이미지를 찾을 수 없습니다.");
	}

	// 배경 이미지 설정
	if (imageData.backdrops && imageData.backdrops.length > 0) {
		const secondImage = imageData.backdrops[1]; // 두 번째 배경 이미지 사용
		const backgroundURL = `${imageURL}${secondImage.file_path}`;

		// #details 요소의 배경 이미지로 설정
		const detailsElement = document.getElementById("details");
		detailsElement.style.backgroundImage = `url('${backgroundURL}')`;
		detailsElement.style.backgroundSize = "cover"; // 배경 이미지를 커버로 설정
	} else {
		console.log("적합한 배경 이미지를 찾을 수 없습니다.");
	}
}

// 페이지 로드 시 실행되는 함수들
document.addEventListener("DOMContentLoaded", () => {
	fetchCast();
	fetchMovieDetails();
});

//=================세영 end=====================

//=================김용 start=====================
//addNewComment()함수의 컬렉션값을 영화id로 바꿔야됨
//commentsList()함수에 영화평점도 기존영화 평점과 댓글에 달린 영화 평점 더해서 평균 내야됨
//getDocs에서 불로올려고하는 댓글 DB도 영화ID로 바꿔야됨
// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
	collection,
	addDoc,
	getDocs,
	query,
	updateDoc,
	deleteDoc,
	doc,
	orderBy
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
	apiKey: "AIzaSyBrbPk7mVllZBlcd4NBxrmnkTRUZ0xkxYA",
	authDomain: "kumamovie-f90b2.firebaseapp.com",
	projectId: "kumamovie-f90b2",
	storageBucket: "kumamovie-f90b2.appspot.com",
	messagingSenderId: "189326101065",
	appId: "1:189326101065:web:c7d7977f3eb36528630d98"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//영화ID로 불로온 댓글정보들
let commentData = [];
let querySnapshot = await getDocs(query(collection(db, "userComments"))); //이부분에서 userComments를 영화 id로 바꿔야됨
querySnapshot.forEach(async (doc) => {
	try {
		commentData.push(doc.data());
	} catch (error) {
		console.log("오류남 : ", error);
	}
});

//현재시간을 가져와서 변수에 할당함 (댓글남긴 날짜 시간 남기기위함)
let getCurrentDateTime = () => {
	let now = new Date();
	let year = now.getFullYear();
	let month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 2자리로 표시
	let date = String(now.getDate()).padStart(2, "0"); // 일은 2자리로 표시
	let hours = String(now.getHours()).padStart(2, "0"); // 시간은 2자리로 표시
	let minutes = String(now.getMinutes()).padStart(2, "0"); // 분은 2자리로 표시
	let seconds = String(now.getSeconds()).padStart(2, "0"); // 초는 2자리로 표시

	// YYYY-MM-DD HH:mm:ss 형식으로 반환
	return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

let userLogin = true; //로그인했는지 안했는지 판단함  일단 여기서 로그인했다치고
let userName = "parkparkparkpark yong"; //로그인한 유저의 이름 로그인해서 이름받아왔다치고
let userId = "right2345"; //로그인한 유저의 id 로그인해서 유저의 아이디를 받아왔다치고
let currentDateTime = getCurrentDateTime(); //현재시간을 변수에 넣음

let myCommentStar = document.querySelector("#add-comments .comments-grade"); //공통으로 쓰이는 부분임 댓글 별점 조절하는부분의 부모요소임
//이부분은 평점의 별이 몇개 보일지 정하는 UI임     빨간색 별이 보여지는 범위
let showBox = document.querySelector("#add-comments .comments-grade .red-star-show-box");
let score = document.querySelector("#add-comments .comments-grade-box .point"); //p태그:점수부분
//해당 부모요소에 마우스엔터하고 움직이면 빨간색 별이 보이는 범위를 정하고 이를 150px를 100%로하여 보이는부분을 점수로 환산함
myCommentStar.addEventListener("mouseenter", (event) => {
	event.target.addEventListener("mousemove", (event) => {
		let rect = myCommentStar.getBoundingClientRect();
		let mouseX = event.clientX - rect.left; // 마우스의 X 좌표
		let maxWidth = 150; // 최대 너비
		let percentage = (mouseX / maxWidth) * 100; // 너비를 퍼센트로 변환
		if (percentage > 100) {
			percentage = 100; // 최대값을 초과하지 않도록 보정
		} else if (percentage < 0) {
			percentage = 0;
		}
		score.textContent = `${(percentage / 10).toFixed(1)}`;
		showBox.style.width = `${percentage}%`; // 퍼센트로 설정
		showBox.addEventListener("click", () => {
			score.textContent = `${parseInt((percentage / 10).toFixed(1))}`;
			// console.log((percentage/10).toFixed(1)) // 퍼센트 값 출력
		});
	});
});
//좋아요 버튼 제어하는 부분임 이미 한번 눌렀으면 +1하고 다시 눌렀을경우 -1이 됨 한명이 본인을 포함해 다른사람의 댓글에도 좋아요를 1회한정 할수 있음
const goodBtn = () => {
	let commentList = document.querySelector("#comments-list"); //댓글리스트를 가리킴
	//댓글리스트를 클릭하면
	commentList.addEventListener("click", async (event) => {
		let target = event.target.closest(".comments-good");
		if (event.target == commentList) return; //부모요소를 클릭했다면 이벤트 종료
		if (target) {
			//그 event.target이 .comments-good일경우
			let liClass = target.closest("li").classList.value; //클릭한 댓글리스트내에서 제일 가까운li의 클래스명을 가져온다.
			let isClick = false; //클릭했는지 안했는지 판별하는 변수
			let querySnapshot = await getDocs(query(collection(db, "userComments"))); //여기도 영화id로 바꿔
			//   console.log(liClass);
			querySnapshot.forEach(async (doc) => {
				//영화id로 저장된 댓글DB정보를 가져와서 나열한다.
				try {
					let data = doc.data(); //데이터정보를 모두 가져온다.
					let uniqueId = doc.id; //컬렉션의 문서id를 가져온다.

					if (uniqueId === liClass && !isClick) {
						//문서아이디가 li클래스명과 동일하거나 isClick가 true이면 통과
						let likedUsers = data.likes || {}; // 좋아요를 클릭한 사용자 목록을 가져옵니다.없으면 {}객체로 할당함
						//   console.log(liClass)
						let alreadyLiked = likedUsers[userId]; // 이미 좋아요를 클릭했는지 확인합니다.

						//회원가입 시 아이디에 . 있으면 절대안됨
						// console.log(data.likes);
						if (alreadyLiked) {
							//이미 좋아요를 클릭했다면 -1만하고~ DB를 업데이트 한다. 그리고 .on 클래스도 제거한다.
							// 이미 좋아요를 클릭한 경우, 좋아요를 취소합니다.
							await updateDoc(doc.ref, {
								good: data.good - 1,
								[`likes.${userId}`]: false // 사용자의 좋아요를 취소합니다.
							});
							document.querySelector("#good-plus").classList.remove("on");
						} else {
							// 좋아요를 클릭하지 않은 경우, 좋아요수를 +1합니다.
							await updateDoc(doc.ref, {
								good: data.good + 1,
								[`likes.${userId}`]: true // 사용자의 좋아요를 추가합니다.
							});
							//   console.log(document.querySelector("#good-plus"));
							//   document.querySelector("#good-plus").classList.remove("on");
							document.querySelector("#good-plus").classList.add("on");
						}
						isClick = true;
					}
				} catch (error) {
					console.error("데이터 수정 중 오류가 발생했습니다:", error);
				}
			});
		}
		commentsList();
	});
};

//첫댓글 달때 데이터베이스에 정보 넣기 함수
async function addNewComment(commentValue, starWidth, score, userId, userName, currentDateTime) {
	try {
		// 새로운 댓글 데이터 추가
		await addDoc(collection(db, "userComments"), {
			//받아온 영화id를 userComments대신 넣는다.그러면 그 영화에 대한 댓글만 보인다. 초기데이터 폼임
			id: userId,
			name: userName,
			star_width: starWidth,
			score: score,
			time: currentDateTime,
			commentValue: commentValue,
			good: 0
		});
	} catch (error) {
		console.error("댓글 추가 중 오류가 발생했습니다:", error);
	}
}

let createComment = () => {
	let sendComment = document.querySelector("#send-comments-form"); //댓글달기UI에서 send 버튼을 가리킴
	sendComment.addEventListener("click", async () => {
		let commentValue = document.querySelector("#message").value; //쓴글
		if (!commentValue.trim().length) {
			//쓴댓글이 앞뒤 빈칸을 없애고 글자수가 0이면 통과 (댓글을 빈칸으로만 썼거나 안쓴거랑 같음)
			alert("댓글 내용을 작성해주세요!");
			return; //알럿 보내고 함수종료하기
		} else if (!parseInt(score.textContent)) {
			alert("평점을 남겨주세요!");
			return; //평점이 없거나 0점이면 함수종료하기
		}
		document.querySelector("#add-comments").style.display = "none"; //위 조건들이 모두 통과 되면 댓글 UI 다시 숨기기
		document.querySelector(".my-comments-box").style.height = "201px"; //댓글 맨위에 내가 남긴 댓글보이게 하기
		let hasId = false;
		let querySnapshot = await getDocs(query(collection(db, "userComments")));
		//정보를 다 가져와 이미 댓글을 달았는지 안했는지 확인한다.(1인1댓글만 가능)
		querySnapshot.forEach((doc) => {
			let data = doc.data();
			if (data.id !== userId) {
				hasId = false;
			} else {
				hasId = true;
			}
		});

		if (hasId) {
			//댓글 이미 달았다면
			alert("댓글 중복 추가 불가합니다. 기존 댓글 수정하세요");
			return; //함수를 종료한다.
		} else {
			//첫댓글이면 여기 통과 되서 댓글이 데이터베이스에 넣음
			addNewComment(commentValue, showBox.style.width, score.textContent, userId, userName, currentDateTime);
		}
		//여기서는 다시 댓글달기UI를 초기상태로 비운다.
		showBox.style.width = "0px";
		document.querySelector("#message").value = "";
		score.textContent = "";

		commentsList();
	});
	//댓글달기 UI 우측 상단의 X를 클릭할경우 실행할 이벤트 (창끄기임)
	document.querySelector(".send-cancel").addEventListener("click", () => {
		document.querySelector("#add-comments").style.display = "none";
		document.querySelector("#message").value = "";
		showBox.style.width = "0%";
		score.textContent = "0.0";
		document.querySelector("#message").textContent = "";
	});
};
createComment();

//댓글 편집 버튼을 클릭하면 댓글 수정하는 화면나옴
const editBtn = () => {
	let editBtn = document.querySelector(".my-comments-box");

	editBtn.addEventListener("click", async (event) => {
		if (event.target.classList.contains("edit-my-comments-btn") || event.target.closest(".edit-my-comments-btn")) {
			// 'edit-my-comments-btn' 클래스를 가진 버튼을 클릭했거나 해당 버튼의 하위 요소를 클릭한 경우
			// 코드 실행
			document.querySelector("#add-comments").style.display = "block"; //댓글달기 UI 다시 나타나
			document.querySelector("#message").focus(); //댓글쓰기에 커서깜빡이게 하고~
			document.querySelector("#send-comments-form").style.display = "none"; //send버튼과Edit버튼을 겹쳐놔서 send를 숨기기
			document.querySelector("#edit-comments-form").style.display = "block"; //edit버튼만 보이게 하기
		} else {
			return; // 수정 버튼을 클릭하지 않은 경우 함수 종료
		}
	});
};
//댓글 수정 버튼을 클릭하면 수정된댓글로 업데이트됨
let editComment = () => {
	let editComment = document.getElementById("edit-comments-form");

	editComment.addEventListener("click", async (event) => {
		let commentValue = document.querySelector("#message").value.trim(); // 쓴글
		if (!commentValue) {
			alert("수정할 댓글 내용을 작성해주세요!");
			return;
		}
		if (!parseInt(score.textContent)) {
			alert("평점을 남겨주세요!");
			return;
		}
		//조건문 통과되면 아래는 수정된 댓글을 업데이트하는 부분임
		document.querySelector("#add-comments").style.display = "none";

		let querySnapshot = await getDocs(query(collection(db, "userComments")));
		querySnapshot.forEach(async (doc) => {
			let data = doc.data();
			if (data.id === userId) {
				await updateDoc(doc.ref, {
					commentValue: commentValue,
					star_width: showBox.style.width,
					score: score.textContent,
					time: currentDateTime
				});
			}
		});

		commentsList();
	});
};

editComment();

const delBtn = () => {
	document.querySelector(".my-comments-box").addEventListener("click", async (event) => {
		// console.log(event.target)
		if (event.target.classList.contains("del-my-comments-btn") || event.target.closest(".del-my-comments-btn")) {
			// 'edit-my-comments-btn' 클래스를 가진 버튼을 클릭했거나 해당 버튼의 하위 요소를 클릭했다면 코드를 실행하기!!!
			try {
				// 해당 사용자 ID를 가진 댓글들을 조회합니다.
				let subDivId = document.querySelector(".my-comments-box>div").id;
				commentsList();
				const docRef = doc(db, "userComments", `${subDivId}`);
				await deleteDoc(docRef);
				// console.log(document.querySelector(`#${subDivId}`))
				document.querySelector(".my-comments-box").style.height = "0px";
				document.querySelector("#add-comments").style.display = "none";
			} catch (error) {
				console.error("댓글 삭제 중 오류 발생:", error);
			}
		} else {
			return; // 그 외의 경우 함수 종료
		}
	});
};
//댓글추가 UI 나오게하는 버튼기능임 로그인안되있으면 댓글달기 불가
let addComments = () => {
	document.querySelector("#add-btn").addEventListener("click", () => {
		if (userLogin) {
			document.querySelector("#add-comments").style.display = "block";
			document.querySelector("#message").focus();
			document.querySelector("#send-comments-form").style.display = "block";
			document.querySelector("#edit-comments-form").style.display = "none";
		} else {
			return alert("로그인후 댓글 남길 수 있습니다.");
		}
	});
	// 현재 입력한 댓글의 글자수를 실시간으로 업데이트해서 보여줌 댓글달기UI 우측하단.
	document.querySelector("#message").addEventListener("keyup", (event) => {
		if (event.target.value.length > 200) {
			event.target.value.length = 200;
		}
		let userComment = document.querySelector(".comments-form-btn .comment-total-text .total-comments");
		userComment.textContent = `${event.target.value.length}`;
	});
};
addComments();

//댓글리스트를 랜더링함
let commentsList = async () => {
	//백업 const querySnapshot = await getDocs(query(collection(db, "userComments")));
	//await getDocs(query(collection(db, "comments").orderBy("timestamp", "desc")));
	const querySnapshot = await getDocs(
		query(collection(db, "userComments"), orderBy("time", "desc")) //여기서 받아온 댓글데이터의 순서를 최근걸로 정렬함
	);
	// 댓글 목록을 배열에 저장
	let totalComments = [];
	let commentsTemplate = "";
	querySnapshot.forEach((doc) => {
		let item = doc.data();
		let uniqueId = doc.id;
		let scoreAverage = item.score;
		totalComments.push(Number(scoreAverage));
		if (item.id == userId) {
			let myCommentTemplate = `
          <div id="${uniqueId}" class="my-control">
            <div class="my-comments">
              <div class="my-info">
                <p>${item.name}</p>
                <div class="comments-grade">
                  <img
                    class="white-star"
                    src="./img/star_w.png"
                    alt="white-star"
                  />
                  <div class="red-star-show-box" style='width:${item.star_width}'>
                    <img
                      class="red-star"
                      src="./img/star_r.png"
                      alt="red-start"
                    />
                  </div>
                </div>
                <p class="point">${item.score}</p>
                <p>${item.time}</p>
              </div>
              <div class="my-comments-content">
                <p>
                ${item.commentValue}
                </p>
              </div>
              <div class="my-comments-good">
                <span class="material-symbols-outlined"> thumb_up </span>
                <p>${item.good}</p>
              </div>
            </div>
            <div class="my-comments-edit-btn">
              <div class="edit-my-comments-btn">
                <span class="material-symbols-outlined"> stylus </span>
                <p id='edit-my-comment'>Edit</p>
              </div>
              <p>|</p>
              <div class="del-my-comments-btn">
                <span class="material-symbols-outlined"> delete </span>
                <p>Del</p>
              </div>
            </div>
          </div>
          `;
			document.querySelector("#comments .my-comments-box").innerHTML = myCommentTemplate;
		}
		commentsTemplate += `
          <li class='${uniqueId}'>
                <div class="user-info">
                  <p class="user-name">${item.name}</p>
                  <div class="comments-grade">
                    <img
                      class="white-star"
                      src="./img/star_w.png"
                      alt="white-star"
                    />
                    <div class="red-star-show-box" style='width:${item.star_width}'>
                      <img
                        class="red-star"
                        src="./img/star_r.png"
                        alt="red-start"
                      />
                    </div>
                  </div>
                  <p class="point">${item.score}</p>
                  <p>${item.time}</p>
                </div>
                <div class="comments-content">
                  <p>
                    ${item.commentValue}
                  </p>
                </div>
                <div class="comments-good">
                  <span id='good-plus' class="material-symbols-outlined ${
										item.likes == undefined ? "" : item.likes[userId] ? "on" : ""
									}"> thumb_up </span>
                  <p>${item.good}</p>
                </div>
              </li>
          `;
		document.querySelector("#comments-list").innerHTML = commentsTemplate;

		// Edit 버튼을 클릭한 경우
		editBtn();

		// Delete 버튼을 클릭한 경우
		delBtn();
	});

	//${item.likes ==undefined? 'off':item.likes[userId]?'on':'off'}

	let totalLength = document.querySelector("#comments-title .comments-total .comments-length");
	let averageScore = document.querySelector("#comments-title .comments-total .avaerage-score");

	//❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️평균점수는 기존평균점수 더해서 다시 구해야함
	averageScore.textContent = `${(
		totalComments.reduce((a, b) => {
			return a + b;
		}, 0) / totalComments.length
	).toFixed(1)}`;
	totalLength.textContent = `${totalComments.length > 300 ? "300+" : totalComments.length}`;
	let movieTitle = document.querySelector("#comments-title .comments-total .movie-title");
	movieTitle.textContent = "범죄도시4"; //모든 댓글 위에 있는 영화제목
	let sendModalMovieTitle = document.querySelector("#send-comments .comments-movie-title h3");
	sendModalMovieTitle.textContent = movieTitle.textContent;
};
goodBtn();
commentsList();
//=================김용 end=====================

//=================이효현 start=====================
getRecommandMovieList(MOVIE_ID).then((list) => {
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
//=================이효현 end=====================
