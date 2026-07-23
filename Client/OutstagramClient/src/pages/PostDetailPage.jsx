import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { fetchPost, updatePost } from "../api/post"
import { fetchComments, postComment, deleteComment } from "../api/comments"
import { changeBookmarkedState } from "../api/bookmarks"
import Bookmark from "../components/Bookmark"
import config from "../utils/config"

// [2026-07-23 09:00:40]
// 최초 렌더링 시에 할일들 []
  // 1. 포스트 정보 가져오기
  // 2. 내가 소유자인지 가져오기
  // 3. 댓글들 가져오기
// [본인일 경우] 글 수정/삭제 기능 넣기 []
  // 이미지 이미 만들어져 있는것 삭제 가능
  // 3개 이내로 다시 등록 가능
  // 제목/내용 수정 가능
  // 수정 후 다시 렌더링 해주기
// [누구나(로그인된사람)] 댓글 달기 (제한 없음) []
// [댓글 작성자 본인] 댓글 삭제하기 버튼 []

export default function PostDetailPage() {

  const [commentList, setCommentList] = useState([])
  const [post, setPost] = useState()
  const [isOwner, setIsOwner] = useState(false)
  const [postFetching, setPostFetching] = useState(true)
  const [commentsFetching, setCommentsFetching] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // 직접 작성하는 댓글 창
  const [commentInput, setcommentInput] = useState("")

  // 작성자 수정 폼
  const [titleInput, setTitleInput] = useState("")
  const [contentInput, setContentInput] = useState("")
  const [existingImageUrls, setExistingImageUrls] = useState(post?.imageUrls || [])
  const [newImages, setNewImages] = useState([])

  const { postId } = useParams()

  const navigate = useNavigate()

  // 최초 렌더링 시에 정보들 가져오기
  useEffect(() => {
    async function loadPost() {

      // 포스트 받아서 저장 및 권한 및 북마크 여부 확인해주기
      const postData = await fetchPost({ postId, navigate })
      console.log("post")
      console.log(postData)
      setPost(postData)
      setExistingImageUrls(postData.imageUrls || [])
  
      setPostFetching(false)
  
      // 수정/삭제 설정
      if(postData?.editable) {
        setIsOwner(true)
      }
      else {
        console.log("not owner")
        console.log(post)
      }
      // 북마크 상태 설정
      if(postData?.bookmarked) {
        setBookmarked(true)
      }
  
      // 댓글 정보들 가져오기
      const fetchedComments = await fetchComments({ postId, navigate })
      console.log("fetchComments")
      console.log(fetchedComments)
      setCommentList(fetchedComments)
  
      // 댓글 정보는 뒤에서 렌더링하기
      setCommentsFetching(false)
    }

    loadPost()

  }, [postId])

  async function updateUserPost() {
    if(!titleInput?.trim() || !contentInput?.trim()) {
      // 작성 안내하기
      return
    }

    // 업데이트 처리하기
    await updatePost({ postId, title: titleInput, content: contentInput, existingImageUrls, newImages})

    // 수정 폼 지우기
    setTitleInput("")
    setContentInput("")

    // 에디팅 끄기
    setIsEditing(false)
  }

  return (
    <>
      <h1>포스트 상세 페이지 및 수정</h1>
      <div id="post-container">
        {/* 상단에 사용자 아이디 및 빈 프로필 */}
        <div id="post-author-container">
          <img src="https://media.istockphoto.com/id/1934800957/ko/%EB%B2%A1%ED%84%B0/%EB%82%A8%EC%9E%90-%EB%B9%88-%EC%95%84%EB%B0%94%ED%83%80-%EC%86%8C%EC%85%9C-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%9D%B4%EB%A0%A5%EC%84%9C-%ED%8F%AC%EB%9F%BC-%EB%B0%8F-%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%97%90-%EB%8C%80-%ED%95%9C-%EB%B2%A1%ED%84%B0-%EC%82%AC%EC%A7%84-%EC%9E%90%EB%A6%AC-%ED%91%9C%EC%8B%9C%EC%9E%90-%EC%B1%84%EC%9B%8C%EC%A7%80%EC%A7%80-%EC%95%8A%EC%9D%80-%EC%82%AC%EC%9A%A9%EC%9E%90-%ED%94%84%EB%A1%9C%ED%95%84%EC%97%90-%EB%8C%80%ED%95%9C-%EB%82%A8%EC%84%B1-%EB%B0%8F-%EC%97%AC%EC%84%B1-%EC%82%AC%EC%A7%84-%EC%97%86%EC%9D%8C-%EC%9D%B4.jpg?s=612x612&w=0&k=20&c=dVIc8atlvaHwOwkm_CW7qkH_KEiYPwLUkNDQS5ECGmQ="
           alt="사용자 아이콘" />
          <div id="user">
            <h3>작성자 아이디: {post?.author?.userid}</h3>
          </div>
          {/* 추가로 북마크 여부는 여기에 두기 */}
          {/* 북마크는 상태를 활성화/비활성화로 css 나타내기. (일단 텍스트로 나타내기) */}
          <button onClick={() => changeBookmarkedState({ postId, isBookmarkedCurrent: bookmarked, setBookmarked })}>
            <Bookmark active={bookmarked} />
          </button>
        </div>

        <div id="post-post-comment-container">
          {/* 좌측에는 업로드 이미지 최대 3개까지 스크롤 방식으로 나열 */}
          <div id="post-img-container">
            {
              post?.imageUrls 
              ? post.imageUrls.map((imgUrl, index) => {
                return <img src={`${config.host.origin}${imgUrl}`} key={imgUrl} alt="이미지" />
              })
              : <h4>이미지가 존재하지 않습니다.</h4>
            }
          </div>

          {/* 우측 상단에는 제목, 작성글 + 생성일(수정일) 존재 */}
          <div id="post-title-content-container">
            {
              isOwner && // 작성자여야 버튼 만들어주기
              <div id="post-owner-selection">
                {/* 수정하기 -> 아래 id="content-space" 공간 수정 포멧으로 바꿔주기*/}
                <button onClick={() => setIsEditing(prev => !prev)}>수정하기</button>
                {/* 삭제하기 -> 삭제 요청 보내기 */}
                <button>삭제하기</button>
              </div>

            }
            <h4>isOwner: {String(isOwner)}</h4>
            {
              isEditing
              ? (
                <div id="editing-space">
                  <input placeholder="제목" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} /><br />
                  <textarea placeholder="내용" value={contentInput} onChange={(e) => setContentInput(e.target.value)} />
                  <div>
                    {JSON.stringify(existingImageUrls)}
                  </div>
                  <div>
                    {
                      existingImageUrls.map((url) => {
                        return (<div key={url}>
                          <img src={`${config.host.origin}${url}`} alt="기존 이미지" />
                          <button onClick={() => {
                            setExistingImageUrls(prev => prev.filter((item) => item !== url))
                          }}>
                            삭제
                          </button>
                        </div>)
                      })
                    }
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files)
                        setNewImages(files)
                      }} />
                  <div>
                    {newImages.map((file) => (
                      <img
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt="새 이미지 미리보기" />
                    ))}
                  </div>

                  </div>
                  <button onClick={updateUserPost}>수정하기</button>
                </div>
              )
              : (<div id="content-space">
              <h3>{ post?.title || "제목이 존재하지 않습니다." }</h3>
              <p>{ post?.content || "내용이 존재하지 않습니다." }</p>
              <p>{ post?.updatedAt || post?.createdAt || "0000-00-00" }</p>
            </div>)
            }

            
            
          </div>

          {/* 우측 하단에는 댓글창 존재 */}
          <div id="post-comments-container">
            {/* 댓글 작성 공간 */}
            <div id="post-comment-write">
              <input placeholder="댓글을 작성하세요" value={commentInput} onChange={(e) => setcommentInput(e.target.value)} />
              <button onClick={async () => {
                await postComment({ postId, comment: commentInput })

                const comments = await fetchComments({ postId, navigate })
                setCommentList(comments)

                setcommentInput("")
              }}>작성</button>
            </div>
            {/* 댓글 목록 */}
            {
              commentList.map((comment, index) => {
                return (
                  <div key={comment.commentId} id="post-comment">
                    <h5>작성자: {comment?.author?.userid || "이름없는 작성자"}</h5>
                    <p>{comment?.content || "댓글 내용 존재하지 않음"}</p>
                    {
                      comment.deletable && <button onClick={async () => {
                        // 삭제하고
                        await deleteComment({ commentId: comment.commentId })

                        // 댓글 다시 가져와서
                        const comments = await fetchComments({ postId, navigate })
                        // 그려주기
                        setCommentList(comments)
                      }}>댓글 삭제하기</button>
                    }
                    <p>작성일: {comment.createdAt || "0000-00-00"}</p>
                  </div>
                )
              })
            }
          </div>

        </div>

      </div>
    </>
  )
}
