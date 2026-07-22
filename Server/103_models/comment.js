import mongoose from "mongoose"

/**
 *  {
 *  	_id: ObjectId,
 *  	postId: ObjectId,
 *  	authorId: ObjectId,
 *  	authorUserid: String,
 *  	content: String,
 *  	createdAt: Date
 *  }
 */
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    authorUserid: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

commentSchema.index({ 
  postId: 1,
  createdAt: 1
})

export default mongoose.model("Comment", commentSchema)