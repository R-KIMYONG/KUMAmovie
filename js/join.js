function join() {
	const signupButton = document.getElementsByClassName("signup-btn")[0];

	signupButton.addEventListener("click", () => {
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
		const newKey = `joinInfo${userCount + 1}`;

		// 정보 생성
		const newUser = {
			name,
			id,
			password,
			confirm_password: confirmPassword
		};

		// 정보저장
		localStorage.setItem(newKey, JSON.stringify(newUser));

		console.log(`새 사용자 정보가 ${newKey}에 저장되었습니다.`);
	});
}

window.onload = join;
