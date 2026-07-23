import * as postService from "../04_service/posts.js"
import * as bookmarkService from "../04_service/bookmarks.js"
import {ApiError} from "../102_utils/api/ApiError.js";
import logger from "../102_utils/log.js";

// 포스트를 작성하는 함수
export async function createPost(req, res) {
  const { title, content } = req.body
  const files = req.files || []

  if (!title?.trim() || !content?.trim()) {
      throw new ApiError(400, "title과 content 값이 비어있습니다.")
  }

  const imageUrls = files.map((file) => {
    return `/uploads/posts/${file.filename}`
  })

  const post = await postService.createPost({ userId: req.id, title, content, imageUrls})

  return res.status(201).json({
      success: true,
      data: post
  })
}

// 모든 포스트를 가져오는 함수
/**
 * page=1
 *
 * size=10
 *
 * keyword=검색어
 *
 * sort="latest" | "newest" | "mostViewed"
 *
 * 와 같은 인자를 통해 페이지네이션을 구현해준다.
 *
 * {
 *   "success": true,
 *   "data": {
 *     "posts": [
 *       {
 *         "postId": "게시글 식별자",
 *         "title": "MongoDB 설계 방법",
 *         "authorLoginId": "user01",
 *         "viewCount": 10,
 *         "createdAt": "2026-07-21T10:00:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "size": 10,
 *       "totalPosts": 35,
 *       "totalPages": 4,
 *       "hasNext": true
 *     }
 *   }
 * }
 */
export async function getPosts(req, res) {
    let { page=1, size=10 , keyword="" , sort="latest" } = req.query


    page = Number(page)
    page = page < 1 ? 1 : page
    size = Number(size)
    size = size < 1 ? 1 : size
    if (!Number.isInteger(page) || !Number.isInteger(size)) {
        throw new ApiError(400, "page, size가 숫자여야합니다.")
    }


    if(!["latest", "newest", "mostViewed"].includes(sort)) {
        sort = "newest"
    }
    // 그대로 반환 가능한 응답 데이터 뽑아주기
    const { posts, pagination }
            = await postService.getPosts({ page, size , keyword , sort })

    res.status(200).json({
        success: true,
        data: {
            posts,
            pagination
        }
    })
}

// id로 포스트를 가져오는 함수
export async function getPost(req, res) {
    const id = req.params.id
    const userId = req.id

    const post = await postService.getById(id)

    // 뽑은 post가 있는지 검사
    if(!post) {
        return res.status(404).json({ message: `${id}의 포스트가 없습니다` })
    }
    let editable = false
    // post의 authorId가 현재 userId와 동일한지 확인
    if(String(post.authorId) === String(userId)) {
        editable = true
    }

    // 사용자가 포스팅을 북마크 했는지 확인
    const bookmarked = await bookmarkService.checkUserBookmarkPostById({ userId, postId: post._id })

    // 조회수 올려주기 [실패해도 그대로 반환해주기]
    try {
        await postService.increasePostView({ postId })
    } catch (error) {
        logger("/03_controller/posts.js getPost",
         `error: ${JSON.stringify(error)}`, "ERROR")
    }


    // 반환하기
    return res.status(200).json({
        success: true,
        data: {
            postId: post._id,
            title: post.title,
            content: post.content,
            author: {
                id: post.authorId,
                userid: post.authorUserid
            },
            viewCount: post.viewCount,
            imageUrls: post.imageUrls,
            bookmarked,
            editable,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }
    })
}

// 포스트를 수정하는 함수
export async function updatePost(req, res) {
    // 사용자 아이디
    const userId = req.id
    // 포스팅 아이디
    const postId = req.params.id
    // 내용
    const { title, content } = req.body

    if (!title?.trim() || !content?.trim()) {
        throw new ApiError(400, "title과 content 값이 비어있습니다.")
    }

    // 그대로 둘 이미지들 받아놓기
    let existingImageUrls
    try {
        existingImageUrls = JSON.parse(req.body.existingImageUrls || "[]")
    } catch (error) {
        throw new ApiError(400, "existingImageUrls 형식이 올바르지 않습니다.")
    }

    // 새로 받은 이미지 뽑아서 쓰기
    const newImageUrls = (req.files || []).map((file) => {
        return `/uploads/posts/${file.filename}`
    })

    const imageUrls = [...existingImageUrls, ...newImageUrls]

    if (imageUrls.length > 3) {
        return res.status(400).json({
            message: "이미지는 최대 3개까지 등록할 수 있습니다."
        })
    }

    const updatedPost = await postService.updatePost({ postId, userId, title, content, imageUrls })

    if(!updatedPost) {
        return res.status(404).json({
            success: false,
            data: "no content"
        })
    }

    return res.status(200).json({
        success: true,
        data: {
            postId: updatedPost._id,
            updatedAt: updatedPost.updatedAt
        }
    })
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res) {
    const userId = req.id
    const postId = req.params.id
    const post = await postService.getById(postId)

    if (!post) {
        return res.status(404).json({ message: `${postId}의 포스트가 없습니다` })
    }

    if (!post.authorId || !req.id ||  String(post.authorId) !== String(req.id)) {
        return res.sendStatus(403)
    }
    const deleted = await postService.removeByPostId({ postId, userId })
    if(deleted) {
        return res.sendStatus(204)
    }
    // 동일하지만 명시적으로 반환
    return res.sendStatus(204)
}
