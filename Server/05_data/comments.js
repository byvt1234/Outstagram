import Comment from "../103_models/comment.js";

/**
 * postId를 통해 모든 댓글 삭제하기
 *
 * 삭제 결과를 true/false로 반환
 */
export async function deleteAllByPostId({ postId, session }) {
    return await Comment.deleteMany({ postId: postId }).session(session)
}