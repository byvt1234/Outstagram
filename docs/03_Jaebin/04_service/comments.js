import { deleteByCommentId, getComment, addComment } from "../05_data/comments.js"

export async function getAll(postId,loginUserId){
    const datas= await getComment(postId)

    return {comments:datas.map(comment => ({
        commentId: comment._id,
        postId: comment.postId,
        author: {
            id: comment.authorId,
            userid: comment.authorUserid,
        },
        content: comment.content,
        deletable:comment.authorId.toString() === loginUserId.toString(),
        createdAt: comment.createdAt,
    }))}
}
export async function createCommetBypostId(postId,user_id,userid,content){
    const comment=await addComment(postId,user_id,userid,content)

    return {
        commentId: comment._id,
        postId: comment.postId,
        author: {
            id: comment.authorId,
            userid: comment.authorUserid,
        },
        content: comment.content,
        createdAt: comment.createdAt,
    }
}

export async function  deleteByComment(commentId, user_Id) {

    const result=await deleteByCommentId(commentId, user_Id)
    return result
}
