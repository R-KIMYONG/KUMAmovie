import { getLocalStorage, setLocalStorage } from "./localstorageGetSet.js";
import { setSearchParams } from "./setSearchParams.js";

const loginForm = document.getElementById('login-form');
const currId = getLocalStorage('movieid');
const loggedInIds = getLocalStorage('joinInfo');

const handleSubmit = (e) => {
    e.preventDefault();
    const inputId = loginForm.userId.value;
    const inputPassword = loginForm.userPw.value;

        console.log(loggedInIds)

        if(loggedInIds){
            const filtered = loggedInIds.filter(e => {
                if(e.id === inputId && e.password === inputPassword)
                return e
            });

            if(filtered.length > 0){
                const a = setSearchParams(currId);

                window.location.href = a;

                const loginInfo = { isLogin : true, id: inputId };
                setLocalStorage('islogin', JSON.stringify(loginInfo));
            }else{
                alert('아이디 비밀번호 확인하세요!');
                return;
            }
        }
}

loginForm.addEventListener('submit', handleSubmit)
