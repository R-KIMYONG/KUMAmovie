// detail 페이지로 이동시 실행
export const setSearchParams = (id) => {
	const url = new URL(window.location.href);
	url.pathname = 'detail.html';
	url.searchParams.set("id", id);

	return url.href;
}