import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Mainpage() {
    const API_URL = "http://localhost:8080/api/posts"
    const token = localStorage.getItem("token")

    const [posts, setPosts] = useState([]) 
    const [page, setPage] = useState(1)
    const [size] = useState(10)
    const [keyword, setKeyword] = useState("")
    const [sort, setSort] = useState("latest")
    const [pagination, setPagination] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const fetchPosts = async () => {
      const params = new URLSearchParams({

        page,
        size,
        keyword,
        sort,})

        try {
          const response = await fetch(`${API_URL}?${params}`,{headers: {Authorization: `Bearer ${token}`}})
          if (!response.ok) {
            throw new Error("게시글을 불러오지 못했습니다.")
          }
           const result = await response.json();

          setPosts(result.data.posts)
          setPagination(result.data.pagination)
        } catch (error) {
          console.error(error)
          setError(error.message)
        } finally {
          setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (loading) return <h2>Loading...</h2>
    if (error) return <h2>{error}</h2>

    return (
      <div>
        <div >
          <input type="text" placeholder="검색어를 입력하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
          <button onClick={() => {
            setPage(1)
        }}>검색</button>
        <button onClick={() => navigate('/mypage')}>마이페이지</button>
        <button onClick={() => navigate('/')}>로그아웃</button>
        </div>
        
        <hr />
        <div>
            <p>제목</p>
            <p>작성일시</p>
            <p>작성자</p>
        </div>
        <hr />
        <div>
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.postId} className="post-item" onClick={() => navigate(`/post/${post.postId}`)}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>작성일 : {post.createdAt.split("T")[0]}</p>
                  <p>작성자 : {post.authorUserid}</p>
                </li>))}
            </ul>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>이전</button><span>{page}</span>
            <button disabled={!pagination?.hasNext} onClick={() => setPage(page + 1)}>다음</button>
        </div>
        <button  onClick={() => {console.log("글쓰기")}}>+</button>
      </div>
    )
}