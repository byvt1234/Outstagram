// multipart/form-data를 처리하기 위한 파일

// 설정을 위해 
// - 파일 저장 위치
// - 파일명 생성 규칙
// - 파일 개수 제한
// - 파일 크기 제한
// - 이미지 파일만 허용할지 등 설정

import multer from "multer"
import { createUUIDFileName } from "../102_utils/crypto.js"
import { config } from "../config.js"

// multer() 설정 시에 메모리에 적재하지 않고 그대로 디스크게 저장하는 경우 경로와 파일 이름을 저장해주는 두 함수 생성해주기
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.host.multerUploadDir)
  },

  filename(req, file, cb) {
    const filename = createUUIDFileName({ originalName: file.originalname, userId: req.id })
    cb(null, filename)
  }
})

// 파일 받는 경우에 특정 조건을 만족시키는 Content-Type 파일만 받게 설정하기
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true)
  }
  
  cb(new Error("image file only"))
}

const upload = multer({
  storage,
  limits: {
    files: 3, // 이미지 3개
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
})

export const uploadPostImages = upload.array("images", 3)
export const updatePostImages = upload.array("newImages", 3)