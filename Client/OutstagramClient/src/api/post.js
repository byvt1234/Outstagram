import apiFetch from "./apiClient"
import { useNavigate } from "react-router"



export async function fetchPost({ postId, navigate }) {
  console.log(`fetchPost({ postId: ${postId} }) start`)

  try {
    const response = await apiFetch({ path: `/posts/${postId}`, options: { method: "GET" } })

    if(!response.ok) {
      if(response.status === 404) {
        navigate("/404")
      }
      // 알림하거나 바로 보내주기
      navigate("/main")
    }

    const postData = await response.json()

    if(postData.success !== true) {
      navigate("/main")
    }

    console.log(`fetchPost({ postId: ${postId} }) end`, postData)

    return postData.data
  }
  catch (error) {
    navigate("/main")
  }
  // async function fetchPost() 종료
}

export async function updatePost({ postId, title, content, existingImageUrls, newImages }) {
  try {
    const formData = new FormData()

    formData.append("title", title)
    formData.append("content", content)
    formData.append("existingImageUrls", JSON.stringify(existingImageUrls))
  
    newImages.forEach(file => {
      formData.append("newImages", file)
    });

    await apiFetch({
      path: `/posts/${postId}`,
      options: {
        method: "PATCH",
        body: formData
      }
    })
  } catch (error) {

  }
}