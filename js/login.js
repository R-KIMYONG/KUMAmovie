import { getLocalStorage, setLocalStorage } from "./localstorageGetSet.js";
import { setSearchParams } from "./setSearchParams.js";

const form = document.querySelector('form');
const id = document.querySelector('.id');
const password = document.querySelector('.password');

const currId = getLocalStorage('movieid');

const handleSubmit = (e) => {
    e.preventDefault();

    const users = getLocalStorage('users');

    const inputId = id.value;
    const inputPw = password.value;

    const idMatching = users.filter(e => e.id === inputId);
    const pwMatching = users.filter(e => {
        if(e.id === inputId && e.password === inputPw) return e
    });

    const loginInfo = { isLogin : true, id: inputId }

    if(idMatching.length === 0){
        alert('해당 아이디가 존재하지 않습니다');
        return;
    }else if(pwMatching.length === 0){
        alert('비밀번호가 틀렸습니다!');
        return;
    }else if(pwMatching.length === 1){
        setLocalStorage('islogin', JSON.stringify(loginInfo));
        alert(`${inputId}님 환영합니다`);
        const a = setSearchParams(currId);
        window.location.href = a;
    }
}

form.addEventListener('submit', handleSubmit)