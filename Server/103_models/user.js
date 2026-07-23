import mongoose, { mongo } from "mongoose";

/**
 *  {
 *  	_id: ObjectId,
 *  	userid: String,
 *  	passwordHash: String,
 *  	name: String,
 *  	email: String,
 *  	createdAt: Date,
 *  	updatedAt: Date
 *  }
 */
const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false // 기본 select 에서 제외
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    nickName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    // createdAt과 updatedAt을 한번에 생성
    timestamps: true
  }
)

userSchema.index({ userid: 1 }, { unique: true })
userSchema.index({ email: 1 }, { unique: true })

export default mongoose.model("User", userSchema)