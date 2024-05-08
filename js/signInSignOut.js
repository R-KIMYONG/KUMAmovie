import { getLocalStorage, setLocalStorage } from "./localstorageGetSet.js";

const loginForm = document.getElementById('login-form');

// 로그인 중인지 아닌지에 따라 화면에 보이는 텍스트 변경하는 함수
export const drawLoginState = (isLogin) => {
    const children = reviewWrap.children

    if(isLogin !== null && isLogin.isLogin){
        children[2].innerText = `${isLogin.id}님 환영합니다.`;
        children[3].innerText = 'logout';
        children[4].style.visibility = 'hidden';
        children[5].style.display = 'block';
    }else{
        children[2].innerText = '로그인이 필요합니다';
        children[3].innerText = 'login';
        children[4].style.visibility = 'visible';
    }
}
// 로그 아웃 기능
const signOut = (e) => {
    if(e) e.preventDefault();
    // const MOVIE_ID = getMovieId();
    const loginInfo = { isLogin : false, id : null }
    setLocalStorage('islogin', JSON.stringify(loginInfo));
    const isLogin = getLocalStorage('islogin');
    const reviews = getLocalStorage('reviews');
    // drawLoginState(isLogin);
    // changeLoginStatus(MOVIE_ID);
    // drawReviews(reviews, MOVIE_ID);
}

export const changeLoginStatus = () => {
    const isLogin = getLocalStorage('islogin');
    if(isLogin.isLogin){
        topLoginA.innerText = 'LOGOUT';
        topLoginA.addEventListener('click', signOut);
    }else{
        topLoginA.innerText = 'LOGIN';
        topLoginA.removeEventListener('click', signOut);
    }
}

// 로그인 로그아웃 버튼 핸들러
export const handleLoginLogout = (_, MOVIE_ID) => {
    const isLogin = getLocalStorage('islogin');
    if(isLogin.isLogin){
        signOut();
    }else{
        window.location.href = './login.html'
    }
}