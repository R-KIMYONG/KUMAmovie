function join() {
	const getname = document.getElementsByClassName("name")[0];
	const getemail = document.getElementsByClassName("email")[0];
	const getpw = document.getElementsByClassName("password")[0];
	const checkpw = document.getElementsByClassName("confirm_password")[0];
	const signupButton = document.getElementsByClassName("signup-btn")[0];

	signupButton.addEventListener("click", () => {
		// event.preventDefault();
		// console.log(getname.value);
		// console.log(getemail.value);
		// console.log(getpw.value);
		// console.log(checkpw.value);
		// localStorage.setItem("name", getname);
		// localStorage.setItem("email", getemail);
		// localStorage.setItem("password", getpw);
		// localStorage.setItem("confirm_password", checkpw);

		let joinInfo = {
			name: getname.value,
			email: getemail.value,
			password: getpw.value,
			confirm_password: checkpw.value
		};
		localStorage.setItem("joinInfo", JSON.stringify(joinInfo));
	});
}
window.onload = join;
