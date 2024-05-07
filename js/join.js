import { getLocalStorage, setLocalStorage } from "./localstorageGetSet.js";
import { setSearchParams } from "./setSearchParams.js";

const username = document.querySelector('.name');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const confirmPw = document.querySelector('.confirm_password');
const form = document.querySelector('form');
const agreeCheckbox = document.getElementById("checkbox");

const currId = getLocalStorage('movieid');

const handleSubmit = (e) => {
    e.preventDefault();
    const inputId = username.value;
    const inputEmail = email.value;
    const inputPassword = password.value;
    const confirm = confirmPw.value;
    let isDup = false;
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    const pwValidationRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,10}$/gim;

    const koreanTest = koreanRegex.test(inputId);
    const pwTest = pwValidationRegex.test(inputPassword)

    const data = getLocalStorage('users');

    if(data){
        const filtered = data.filter(e => e.id === inputId);
        if(filtered.length > 0) isDup = true;
    }

    if(inputPassword !== confirm) {
        form.reset();
        alert('두 패스워드가 일치하지 않습니다!')
        return;
    }else if(isDup){
        alert('같은 아이디가 있습니다!');
        return;
    }else if(inputId.length >= 10 || inputPassword.length >= 10){
        alert('아이디, 비밀번호는 10자 이내여야 합니다!');
        return;
    }else if(koreanTest){
        alert('아이디는 영문 및 숫자만 가능합니다!');
        return;
    }else if(!pwTest){
        console.log(inputPassword)
        alert('비밀번호는 4~10자, 영문, 숫자, 특수문자가 반드시 포함되어야 합니다');
        return;
    }else if(!agreeCheckbox.checked){
		alert("이용약관에 동의해야 합니다.");
		return;
	}else{
        let dataArray = [];

        const pack = {
            id : inputId,
            email : inputEmail,
            password :inputPassword
        }

        const loginInfo = { isLogin : true, id: inputId };

        if(data){
            dataArray = [pack, ...data];
        }else{
            dataArray = [pack]
        }
        
        setLocalStorage('users', JSON.stringify(dataArray));
        const result = getLocalStorage('users');

        console.log(result)
        alert('회원가입이 완료되었습니다!');


        setLocalStorage('islogin', JSON.stringify(loginInfo));

        const a = setSearchParams(currId);
        window.location.href = a;
    }
}

form.addEventListener('submit', handleSubmit)