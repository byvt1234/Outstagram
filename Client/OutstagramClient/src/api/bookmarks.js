import apiFetch from "./apiClient";

export async function changeBookmarkedState({ postId, isBookmarkedCurrent, setBookmarked}) {
  console.log(`changeBookmarkedState({ postId: ${postId}, isBookmarkedCurrent: ${isBookmarkedCurrent} }) start`)
  try {
    // {
    //   "success": true,
    //   "data": {
    //     "postId": "게시글 식별자",
    //     "bookmarked": true
    //   }
    // }
    let response
    if(isBookmarkedCurrent) {
      response = await apiFetch({ path: `/posts/${postId}/bookmarks`, options: { method: "DELETE" }})
    }
    else {
      response = await apiFetch({ path: `/posts/${postId}/bookmarks`, options: { method: "POST" }})
    }



    if(!response.ok) {
      if(response.status === 404) {
        // 아무것도 하지 않기 (최대는 모달정도)
      }
      // 알림하거나 바로 보내주기
      if(response.status === 204) [
        // 안내해주기 (안바뀌었다고)
      ]
    }

    console.log(`changeBookmarkedState({ postId: ${postId}, isBookmarkedCurrent: ${isBookmarkedCurrent} }) end`, commentData)

    // 상태 바꿔주기
    setBookmarked(!isBookmarkedCurrent)

  } catch (error) {
    console.log(`changeBookmarkedState({ postId: ${postId}, isBookmarkedCurrent: ${isBookmarkedCurrent} }) error`, error)
  }
}