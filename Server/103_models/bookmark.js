import mongoose from "mongoose"

/**
 *  {
 *  	_id: ObjectId,
 *  	userId: ObjectId,
 *  	postId: ObjectId,
 *  	createdAt: Date
 *  }
 */
const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    }
  },
  {
    timestamps: true
  }
)

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true })

export default mongoose.model("Bookmark", bookmarkSchema)