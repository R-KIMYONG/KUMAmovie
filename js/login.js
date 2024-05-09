"use strict";

function login() {
	const loginButton = document.getElementsByClassName("login-button")[0];

	loginButton.addEventListener("click", (event) => {
		event.preventDefault(); // 폼 제출 동작 방지

		//입력필드
		const loginid = document.getElementsByClassName("id")[0];
		const loginpwd = document.getElementsByClassName("pwd")[0];

		//필드에서 추출한 사용자 입력
		const id = loginid.value;
		const password = loginpwd.value;

		if (!id || !password) {
			alert("아이디와 비밀번호를 모두 입력해주세요.");
			return;
		}

		let userFound = false;

		// 모든 사용자 정보를 반복하면서 입력된 정보와 일치하는지 확인
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith("joinInfo")) {
				const userInfo = JSON.parse(localStorage.getItem(key));

				// ID가 일치하는지 확인
				if (userInfo.id === id) {
					userFound = true;

					// 비밀번호가 일치하는지 확인
					if (userInfo.password === password) {
						localStorage.setItem("loginUsername", userInfo.name);
						localStorage.setItem("loginUserid", userInfo.id);
						alert("로그인에 성공했습니다.");
						window.location.href = "index.html";
						return;
					} else {
						alert("비밀번호가 일치하지 않습니다.");
						return;
					}
				}
			}
		}

		// 해당 ID가 없을 때
		if (!userFound) {
			alert("해당 아이디의 사용자를 찾을 수 없습니다.");
		}
	});
}
login();
