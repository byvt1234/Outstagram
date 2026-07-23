import apiFetch from "./apiClient";
import { useNavigate } from "react-router"

/**
 * 특정 postId에 대한 댓글 전체 가져오기
 */
export async function fetchComments({ postId, navigate }) {
  console.log(`fetchComments({ postId: ${postId} }) start`)

  

  try {
    const response = await apiFetch({ path: `/posts/${postId}/comments` })

    if(!response.ok) {
      if(response.status === 404) {
        navigate("/404")
      }
      // 알림하거나 바로 보내주기
      navigate("/main")
    }

    const commentsData = await response.json()

    if(commentsData.success !== true) {
      navigate("/main")
    }

    console.log(`fetchComments({ postId: ${postId} }) end`, commentsData)
    return commentsData.data.comments
  }
  catch (error) {
    // navigate("/main")
    console.log(`fetchComments({ postId: ${postId} }) error`, error)
  }
  // async function fetchPost() 종료
}

/**
 * 댓글 작성하기 { postId, comment }
 */
export async function postComment({ postId, comment }) {
    console.log(`postComment({ postId: ${postId}, comments: ${comment} }) start`)

    try {
      if(!comment?.trim()) {
        
      }
      const response = await apiFetch({ 
        path: `/posts/${postId}/comments`, 
        options: { 
          method: "POST",
          body: {
            content: String(comment)
          }
        } })

    if(!response.ok) {
      if(response.status === 404) {
        // 작성실패 안내
      }
      if(response.status === 400) {
        // 작성실패 안내
      }
      // 알림하거나 바로 보내주기
      return null
    }

    const createdCommentData = await response.json()

    if(createdCommentData.success !== true) {
      // 작성 실패 안내
      return null
    }

    console.log(`postComment({ postId: ${postId}, comments: ${comment} }) end`, createdCommentData)
    return createdCommentData.data
  }
  catch (error) {
    // 작성 실패 안내
    return null
  }
  // async function postComment() 종료
}

export async function deleteComment({ commentId }) {
  try {
    console.log(`deleteComment({ postId: ${postId}, comments: ${comment} }) start`)
    
    const response = await apiFetch({ path: `/comments/${commentId}`, options: { method: "DELETE"} })

    if(response.status === 204) {
      console.log(`deleteComment({ commentId: ${commentId} }) end`, response.status)
    }

  } catch (error) {
    console.log(`deleteComment({ commentId: ${commentId} }) error`, error)
  }
}