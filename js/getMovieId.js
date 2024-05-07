// 쿼리스트링에서 영화 id 값 찾아오는 함수
export function getMovieId() {
	const url = new URL(window.location.href);
	const MOVIE_ID = Number(url.searchParams.get("id"));

	return MOVIE_ID;
}

export const MOVIE_ID = getMovieId();
