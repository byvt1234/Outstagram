// models

import mongoose from "mongoose"

/**
 *  {
 *  	_id: ObjectId,
 *  	authorId: ObjectId,
 *  	authorUserid: String,
 *  	title: String,
 *  	content: String,
 *  	imageUrls: [String], // 최대 3개
 *  	viewCount: Number,
 *  	createdAt: Date,
 *  	updatedAt: Date
 *  }
 */
const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 직접 ./user.js 에서 정의한 User타입
      required: true
    },

    authorUserid: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    imageUrls: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 3
        },
        message: "image could registered 3 as max"
      }
    },

    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model("Post", postSchema)