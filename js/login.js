"use strict";
// 회원가입 정보 -> key : joinInfo_aa , key :	{"name":"이가현","id":"aa","password":"1111","confirm_password":"1111"}

function login() {
    // 1. id, pw를 사용자에게 입력받는다.
    const inputId = document.getElementById("checkId").value;
    const inputPwd = document.getElementById("checkPw").value;
    const loginButton = document.getElementById("login-btn");

    // 2. 로컬스토리지에서 joinInfo 값을 가져온다.
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("joinInfo")) {
            const currentMember = JSON.parse(localStorage.getItem(key));
            console.log(currentMember);
            // 3. joinInfo 배열을 순회하면서 uerID, userPw와 일지하는 값 찾기
            let userLogin = false; //로그인 여부 확인

            for (let i = 0; i < localStorage.length; i++) {
                //localStorage에 저장되어 있는 값과 입력한 값이 일치하는지 확인
                if (inputId === currentMember.id && inputPwd === currentMember.password) {
                    // 4-1. 일치하는 것을 찾으면 로그인 성공
                    alert("로그인 되었습니다!");
                    const userId = inputId; //아이디 로컬스토리지에 저장
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("loginUsername", currentMember.name); //이름 로컬스토리지에 저장
                    userLogin = true;
                    location.href = "index.html"; //로그인시 메인페이지로 이동시키기
                    break;
                }
                //4-2. 일치하지 않으면 로그인 실패
                if (!userLogin) {
                    alert("ID 또는 Password를 확인해주세요.");
                    break;
                }
            }
        }
    }
}


