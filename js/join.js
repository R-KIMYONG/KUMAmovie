function validateForm() {
	var form = document.getElementById("signup-form");
	var inputs = form.getElementsByTagName("input");

	// 모든 입력 필드가 채워져 있는지 확인
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value.trim() === "") {
			alert("모든 필드를 채워주세요.");
			return false;
		}
	}

	// 이용약관 동의 여부 확인
	var agreeCheckbox = document.getElementById("checkbox");
	if (!agreeCheckbox.checked) {
		alert("이용약관에 동의해야 합니다.");
		return false;
	}

	return true;
}
