const openTerm = document.querySelector('.open_terms');
const closeTerm = document.querySelector('.close');

function openTermsModal(e) {
    e.preventDefault();
	document.getElementById("terms-modal").style.display = "block";
}

function closeTermsModal() {
	document.getElementById("terms-modal").style.display = "none";
}

openTerm.addEventListener('click', openTermsModal);
closeTerm.addEventListener('click', closeTermsModal)