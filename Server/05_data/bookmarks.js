import Bookmark from "../103_models/bookmark.js";


/**
 * 해당 북마크가 있으면 bookmark._id 반환하는 함수
 *
 * 없으면 null
 */
export async function checkUserBookmarkPostById({ userId, postId }) {
    return await Bookmark.exists({ userId, postId })
}


/**
 * postId를 통해 모든 북마크 삭제하기
 *
 * 삭제 결과를 true/false로 반환
 */
export async function deleteAllByPostId({ postId, session }) {
    return await Bookmark.deleteMany({ postId: postId }).session(session)
}