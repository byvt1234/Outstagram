import * as bookmarkRepository from "../05_data/bookmarks.js"

/**
 * 사용자의 userId와 postId를 이용해서 true/false를 반환하는 함수
 */
export async function checkUserBookmarkPostById({ userId, postId }) {
    if (!userId || !postId) {
        return false
    }

    const bookmarkId = await bookmarkRepository.checkUserBookmarkPostById({ userId, postId })

    return !!bookmarkId
}