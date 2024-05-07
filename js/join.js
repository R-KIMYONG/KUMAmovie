function join() {
	const signupButton = document.getElementsByClassName("signup-btn")[0];

	signupButton.addEventListener("click", (event) => {
		event.preventDefault(); //폼 제출 동작 방지

		const name = document.getElementsByClassName("name")[0].value;
		const id = document.getElementsByClassName("id")[0].value;
		const password = document.getElementsByClassName("password")[0].value;
		const confirmPassword = document.getElementsByClassName("confirm_password")[0].value;

		// 기존 데이터의 수를 확인하여 새로운 키 생성
		let userCount = 0;

		// localStorge의 모든 키를 반복하며 사용자 정보의 수 세기
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith("joinInfo")) {
				userCount++;
			}
		}

		// 키 생성
		// const newKey = `joinInfo${userCount + 1}`;
		const newKey = `joinInfo_${id}`; // 덮어쓰기 방지로 키를 id로 바꿈

		// 정보 생성
		const newUser = {
			name,
			id,
			password,
			confirm_password: confirmPassword
		};

		// 정보저장
		localStorage.setItem(newKey, JSON.stringify(newUser));
		alert("회원가입이 완료되었습니다.");

		console.log(`새 사용자 정보가 ${newKey}에 저장되었습니다.`);

		location.reload();
	});

	//탈퇴
	const quitButton = document.getElementsByClassName("quit-btn")[0];

	quitButton.addEventListener("click", () => {
		const quitId = document.getElementsByClassName("quit-id")[0].value;

		//같은 ID 찾고 삭제
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith("joinInfo")) {
				const user = JSON.parse(localStorage.getItem(key));
				if (user.id === quitId) {
					localStorage.removeItem(key);
					console.log(`사용자 ${key}가 탈퇴되었습니다`);
					alert(`${user.id}가 탈퇴되었습니다`);
					location.reload();
				}
			} else {
				console.log("해당 ID의 사용자를 찾을 수 없습니다");
				alert("해당 ID의 사용자를 찾을 수 없습니다");
			}
		}
	});
}
window.onload = join;
