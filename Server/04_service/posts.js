// postService

import * as userRepository from "../05_data/users.js"
import * as postRepository from "../05_data/posts.js"
import * as commentRepository from "../05_data/comments.js"
import * as bookmarkRepository from "../05_data/bookmarks.js"
import mongoose from "mongoose";
import {ApiError} from "../102_utils/api/ApiError.js";
import logger from "../102_utils/log.js";

export async function createPost({ userId, title, content, imageUrls}) {
  // id (ObjectId)를 통해 사용자 userid 뽑기
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "토큰 형식이 올바르지 않습니다.")
  }
  const user = await userRepository.findById(userId)

  const post = await postRepository.create({ 
    authorId: userId,
    authorUserid: user.userid,
    title, content, imageUrls
  })

  return { postId: post._id, createdAt: post.createdAt} 
}

export async function getPosts({ page, size , keyword , sort }) {


  const posts =  await postRepository.getAll({ page, size , keyword , sort })

  const totalPosts = await postRepository.getTotalPostsCount(keyword)

  const pagination = {
    page,
    size,
    totalPosts,
    totalPages: Math.ceil(totalPosts/size),
    hasNext: page < Math.ceil(totalPosts/size)
  }

  return { posts, pagination }
}

/**
 * 글 번호에 대해서 controller에서 아래 데이터를 뽑아주는 service
 *
 * {
 *     id,
 *     authorId,
 *     authorUserid,
 *     title,
 *     content,
 *     imageUrls,
 *     viewCount,
 *     createdAt,
 *     updatedAt
 *   }
 *
 */
export async function getById(postId) {

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(400, "postId 형식이 올바르지 않습니다.")
  }

  return await postRepository.getById(postId)
}

/**
 * input:
 * { postId, userId, title, content, imageUrls }
 *
 *  위 데이터를 받아서 userId가 postId의 주인이 맞으면 업데이트 해주는 함수
 *
 *  업데이터 실패하면 null 반환
 */
export async function updatePost({ postId, userId, title, content, imageUrls }) {
  // 사용자가 postId의 주인이 맞는지 확인하기 (boolean)
  if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "PostId 또는 UserId 형식이 올바르지 않습니다.")
  }

  const canContinue = await postRepository.checkPostOwnedByUserId({ postId, userId})

  if(!canContinue) {
    throw new ApiError(403, "authorization forbidden", {})
  }

  return await postRepository.updatePost({ postId, title, content, imageUrls })
}

/**
 * postId에 해당하는 포스트를 삭제 후 true 또는 false를 반환하는 함수
 *
 * 게시글과 북마크 또한 모두 반환
 *
 * **모두 트랜잭션으로 동작하게 됩니다.**
 *
 * userId가 소유자가 아니면 에러를 냄
 */
export async function removeByPostId({ postId, userId }){
  // 사용자가 자기 포스트가 맞는지 최종 확인
  if(!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "postId 또는 userId가 유효하지 않습니다.")
  }

  const isOwner = await postRepository.checkPostOwnedByUserId({postId, userId})

  if(!isOwner) {
    throw new ApiError(403, "접근 권한이 없습니다.")
  }

  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      await commentRepository.deleteAllByPostId({ postId, session })

      await bookmarkRepository.deleteAllByPostId({ postId, session })

      const deletePost = await postRepository.deleteByPostId({ postId, session })

      if(!deletePost) {
        return
      }
    })
  } catch (error) {
    logger("/04_service/posts.js removeByPostId",
        `error: ${error}`)
    throw error
  } finally {
    // 트랜잭션 종료
    await session.endSession()
  }

  return true
}

/**
 * 포스트id의 viewCount만 count(=1) 올려주는 함수
 */
export async function increasePostView({ postId, count=1 }) {
  await postRepository.increasePostView({ postId, count })
}