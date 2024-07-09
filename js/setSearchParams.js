// detail 페이지로 이동시 실행
export const setSearchParams = (id) => {
	const url = new URL(window.location.href);

	if(url.host.includes('127')){
		console.log('로컬환경입니다')
		url.pathname = '/detail.html';
	}else{
		console.log('배포환경입니다')
		url.pathname = '/KUMAmovie/detail.html'; 
	}

	url.searchParams.set("id", id);

	return url.href;
}