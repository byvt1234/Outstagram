import *  as commentService from "../04_service/comments.js"
import {ApiError} from "../102_utils/api/ApiError.js"
import * as userRepository from "../05_data/users.js"
// throw new ApiError(400,"")
export async function getCommentsByPostId(req, res) {
        const postId=req.params.postId
        const loginUserId = req.id
        const data= await commentService.getAll(postId,loginUserId)
        res.status(200).json({
            success:true,
            data
        })
}

export async function createComment(req, res) {
    const postId=req.params.postId
    const user_id = req.id
    const {content}=req.body
    if(!content){
         throw new ApiError(403,"403 not content")
    }
    const user = await userRepository.findById(user_id)
    const data=await commentService.createCommetBypostId(postId,user_id,user.userid,content)
    res.status(201).json({
            success:true,
            data
        })
}
export async function deleteComment(req,res) {
    const commentId= req.params.commentId
    const user_Id = req.id
    await commentService.deleteByComment(commentId, user_Id);
    res.status(204).send("204 No Content")
}

// 댓글 업데이트 기능은 존재하지 않음
// export async function updateComment(req, res) {
// }
