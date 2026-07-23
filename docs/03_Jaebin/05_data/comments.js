import Comment from "../103_models/comment.js";
import {ApiError} from "../102_utils/api/ApiError.js";

//댓글 생성 

export async function addComment(postId,user_id,userid,content){
    return await Comment.create({
        postId,
        authorId: user_id,
        authorUserid: userid,
        content,
    })
}
//댓글 조희
export async function getComment(postId){
    return await Comment.find({postId}).sort({ createdAt: 1 })
}
//댓글 삭제
export async function deleteByCommentId(CommentId,userId){
    const check= await Comment.findOne({ _id: CommentId }).select("authorId")
    if(!check){
        throw new ApiError(404,"404 Not Found")
    }
    if(check.authorId.toString() !== userId.toString()){
        throw new ApiError(403,"403 Forbidden")
    }
    return await  Comment.deleteOne({_id: CommentId })
}

/**
 * postId를 통해 모든 댓글 삭제하기
 *
 * 삭제 결과를 true/false로 반환
 */
export async function deleteAllByPostId({ postId, session }) {
    return await Comment.deleteMany({ postId: postId }).session(session)
}
