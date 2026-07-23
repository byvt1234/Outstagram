// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
//                                 Prev Version [X-Server]                             // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// import MongoDB, { ReturnDocument } from "mongodb"
// import * as userRepository from "./auth.js"
// import { getPosts } from "../101_db/database.js"

// const ObjectId = MongoDB.ObjectId

// // 포스트 작성
// export async function create(text, id) {
//     return userRepository.findById(id).then((user) => getPosts().insertOne({
//         text,
//         createdAt: new Date(),
//         idx: user.id,
//         name: user.name,
//         userid: user.userid
//     })).then((result) => {
//         return getPosts().findOne({ _id: result.insertedId })
//     })
// }

// // 모든 포스트를 리턴
// export async function getAll() {
//     return getPosts().find().sort({ createdAt: -1 }).toArray()
// }

// // 사용자 아이디에 대한 포스트를 리턴
// export async function getAllByUserid(userid) {
//     return getPosts().find({ userid }).sort({ createdAt: -1 }).toArray()
// }

// // 글 번호(id)에 대한 포스트를 리턴
// export async function getById(id) {
//     return getPosts().find({ _id: new ObjectId(id) }).next().then(mapOptionalPost)
// }

// // 포스트 수정
// export async function update(id, text) {
//     return getPosts().findOneAndUpdate(
//         { _id: new ObjectId(id) },
//         {
//             $set: {
//                 text: text.trim(),
//                 updateAt: new Date()
//             }
//         },
//         { returnDocument: "after" }
//     ).then((result) => result)
// }

// // 포스트 삭제
// export async function remove(id) {
//     return getPosts().deleteOne({ _id: new ObjectId(id) })
// }

// function mapOptionalPost(post) {
//     return post ? { ...post, id: post._id.toString() } : post
// }
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

import Post from "../103_models/post.js"

// {
//   _id: ObjectId,
//   authorId: ObjectId,
//   authorUserid: String,
//   title: String,
//   content: String,
//   imageUrls: [String], // 최대 3개
//   viewCount: Number,
//   createdAt: Date,
//   updatedAt: Date
// }

// 포스트 작성
export async function create({ authorId, authorUserid, title, content, imageUrls }) {
  return await Post.create({ authorId, authorUserid, title, content, imageUrls })
}

// 모든 포스트를 리턴
/**
 * input
 *
 * { page=1, size=10 , keyword="" , sort="newest" }
 *
 * return
 *
 *  "postId": "게시글 식별자",
 *  "title": "MongoDB 설계 방법",
 *  "authorLoginId": "user01",
 *  "viewCount": 10,
 *  "createdAt": "2026-07-21T10:00:00.000Z"
 *
 */
export async function getAll({ page=1, size=10 , keyword="" , sort="newest" }) {

  const condition =
      sort === "newest"
      ? { createdAt: -1 }
      : sort === "latest"
        ? { createdAt: 1 }
          : { viewCount: -1, createdAt: -1 } // mostViewed

  return await Post.find({
        title: {
          $regex: keyword,
          $options: "i",
        }
      }).sort(condition)
      .skip((page-1)*size)
      .limit(size).select("_id title authorUserid viewCount createdAt")
}

// 사용자 아이디에 대한 포스트를 리턴
// export async function getAllByUserid(userid) {
//
// }

/**
 * 글 번호(id)에 대한 포스트를 리턴
  */
export async function getById(id) {
  return await Post.findById(id)
        .select("_id authorId authorUserid title content imageUrls viewCount createdAt updatedAt")
}

// 포스트 수정
export async function update(id, text) {
  
}

// 포스트 삭제
export async function remove(id) {
  
}

/**
 * 모든 포스팅의 개수 반환
 */
export async function getTotalPostsCount(keyword="") {
  return await Post.countDocuments({
    title: {
      $regex: keyword,
      $options: "i",
    }
  })
}

/**
 * 사용자가 postId를 소유했는지 확인 후 true/false를 반환하는 함수
 */
export async function checkPostOwnedByUserId({ postId, userId }) {
    const result = await Post.exists({ _id: postId, authorId: userId })
    return !!result
}

/**
 * 포스팅 title, content, imageUrls 를 업데이트 해주는 함수
 *
 * 없으면 null
 *
 * 변환되면 해당 post 객체를 반환한다.
 *  {
 *    _id: ObjectId,
 *    authorId: ObjectId,
 *    authorUserid: String,
 *    title: String,
 *    content: String,
 *    imageUrls: [String], // 최대 3개
 *    viewCount: Number,
 *    createdAt: Date,
 *    updatedAt: Date
 *  }
 */
export async function updatePost({ postId, title, content, imageUrls }) {
    const result = await Post.findByIdAndUpdate(
        postId,
        {
            title,
            content,
            imageUrls
        },
        {
            new: true
        }
    )
    return result
}

/**
 * postId에 해당하는 포스트를 삭제 후 삭제 전 객체를 반환하거나 없으면 null을 반환하는 함수
 */
export async function deleteByPostId({postId, session}) {
    return await Post.findByIdAndDelete(postId).session(session)
}

/**
 * count만큼 posts._id의 viewCount를 높여주는 함수
 * 반환 값으로 post 객체를 그대로 반환한다
 */
export async function increasePostView({ postId, count }) {
    return await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                viewCount: count
            }
        },
        {
            new: true,
            runValidators: true
        }
    )
}