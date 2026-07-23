## 공통 규칙

```
Base URL: /api
```

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "오류 메시지"
  }
}
```

---

# 인증 방식

- 저장 - `token: jwt.sign({ id: user._id}, jwt_secure, { expiredIn }`
- 사용: `Request Header` - `Bearer {jwt_token}`

---

# 인증 API

- **POST `/auth/login`**
    
    ### 설명
    
    > 아이디와 비밀번호를 검증하고 로그인한다.
    > 
    
    > jwt Bearer
    > 
    
    ### 인증
    
    불필요
    
    ### Request Body
    
    ```json
    {
      "userId": "user01",
      "password": "password123!"
    }
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "token": "jwt token [user._id]",
        "user": {
    			"id": "user.userid"
        }
    }
    ```
    
    ### 오류
    
    - `400 Bad Request`: 필수값 누락
    - `401 Unauthorized`: 아이디 또는 비밀번호 불일치
    

---

- **POST `/auth/logout`**
    
    ### 설명
    
    - localstorage에 `Authorization` 을 넣기때문에 클라이언트에서 구현한다. api는 사실 없다
    
    ### 인증
    
    필요
    
    ### Response
    
    ```
    204 No Content
    ```
    

---

- **GET `/auth/me`**
    
    ### 설명
    
    현재 로그인한 사용자의 정보를 조회한다.
    
    새로고침 후 로그인 상태를 확인할 때 사용할 수 있다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "token": "user jwt token [user._id]",
        "userid": "user.userid"
      }
    }
    ```
    

---

# 회원 API

- **POST `/users`**
    
    ### 설명
    
    새로운 사용자 계정을 생성한다.
    
    ### 인증
    
    불필요
    
    ### Request Body
    
    ```json
    {
      "userid": "user01",
      "password": "password123!",
      "name": "홍길동",
      "email": "user01@example.com"
    }
    ```
    
    ### 검증
    
    - 아이디 형식 검사
    - 아이디 중복 검사
    - 비밀번호 정규식 검사
    - 비밀번호 확인 일치 검사
    - 이메일 형식 검사
    - 이메일 중복 검사
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "_id": "6a6032f093f55b24acb6b45f",
        "userid": "user01",
        "name": "홍길동",
        "email": "user01@example.com",
        "createdAt": "2026-07-21T10:00:00.000Z",
        "updatedAt": "2026-07-22T03:03:12.928Z",
      }
    }
    ```
    ### 오류
    
    - `409 Conflict`: 아이디 또는 이메일 중복
    - `422 Unprocessable Entity`: 입력값 형식 오류
    - `422 Unprocessable Entity`: 비밀번호 확인 불일치

---

- **GET `/users/idDuplicated`**
    
    ### 설명
    
    회원가입에 사용할 아이디의 중복 여부를 확인한다.
    
    ### Query Parameter
    
    ```
    userid=user01
    ```
    
    ### 요청 예시
    
    ```
    GET /api/users/idDuplicated?userid=user01
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "available": true
      }
    }
    ```
    

---

- **GET `/users/emailDuplicated`**
    
    ### 설명
    
    이메일의 중복 여부를 확인한다.
    
    회원가입과 회원정보 수정에서 사용할 수 있다.
    
    ### Query Parameter
    
    ```
    email=user01@example.com
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "available": true
      }
    }
    ```
    

---

- **GET `/users/me`**
    
    ### 설명
    
    마이페이지에 표시할 내 정보를 조회한다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "userId": {"id", "userid"}
        "name": "홍길동",
        "email": "user01@example.com",
        "createdAt": "2026-07-21T10:00:00.000Z",
        "updatedAt": "2026-07-21T10:00:00.000Z"
      }
    }
    ```
    

---

- **PATCH `/users/me`**
    
    ### 설명
    
    현재 로그인한 사용자의 이름과 이메일을 수정한다.
    
    아이디와 비밀번호는 이 API에서 수정하지 않는다.
    
    ### 인증
    
    필요
    
    ### Request Body
    
    ```json
    {
      "name": "김길동",
      "email": "new@example.com"
    }
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "userId": "사용자 식별자",
        "loginId": "user01",
        "name": "김길동",
        "email": "new@example.com",
        "updatedAt": "2026-07-21T11:00:00.000Z"
      }
    }
    ```
    
    ### 오류
    
    - `409 Conflict`: 이메일 중복
    - `422 Unprocessable Entity`: 이메일 형식 오류

---

- **DELETE `/users/me`**
    
    ### 설명
    
    현재 로그인한 사용자 계정을 탈퇴 처리한다.
    
    ### 인증
    
    필요
    
    ### Request Body
    
    ```json
    {
      "password": "password123!"
    }
    ```
    
    ### Response
    
    ```
    204 No Content
    ```
    
    ### 오류
    
    - `401 Unauthorized`: 비밀번호 불일치
    - `404 Not Found`: 사용자 없음

---

# 게시글 API

- **GET `/posts`**
    
    ### 설명
    
    게시글 목록을 조회한다.
    
    제목 검색과 페이지네이션을 지원한다.
    
    ### 인증
    
    필요
    
    ### Query Parameters
    
    ```
    page=1
    size=10
    keyword=검색어
    sort="latest" | "newest" | "mostViewed"
    ```
    
    ### 요청 예시
    
    ```
    GET /api/posts?page=1&size=10&keyword=검색어&sort=latest
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "posts": [
          {
            "postId": "게시글 식별자",
            "title": "MongoDB 설계 방법",
            "authorLoginId": "user01",
            "viewCount": 10,
            "createdAt": "2026-07-21T10:00:00.000Z"
          }
        ],
        "pagination": {
          "page": 1,
          "size": 10,
          "totalPosts": 35,
          "totalPages": 4,
          "hasNext": true
        }
      }
    }
    ```
    

---

- **GET `/posts/{postId}`**
    
    ### 설명
    
    특정 게시글의 상세 내용을 조회한다.
    
    조회 성공 시 조회수를 증가시킬 수 있다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "postId": "게시글 식별자",
        "title": "MongoDB 설계 방법",
        "content": "게시글 내용",
        "author": {
          "userId": "작성자 식별자",
          "loginId": "user01"
        },
        "viewCount": 11,
        "imageUrls": [
          "/uploads/posts/image1.jpg",
          "/uploads/posts/image2.jpg"
        ],
        "bookmarked": true,
        "editable": true,
        "createdAt": "2026-07-21T10:00:00.000Z",
        "updatedAt": "2026-07-21T10:00:00.000Z"
      }
    }
    ```
    
    ### 오류
    
    - `404 Not Found`: 게시글 없음

---

- **POST `/posts`**
    
    ### 설명
    
    새로운 게시글을 작성한다.
    
    이미지는 최대 3개까지 등록할 수 있다.
    
    ### 인증
    
    필요
    
    ### Content-Type
    
    ```
    multipart/form-data
    ```
    
    ### Form Data
    
    ```
    title: 게시글 제목
    content: 게시글 내용
    images[image/*]: 이미지 파일 목록, 최대 3개 
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "postId": "생성된 게시글 식별자",
        "createdAt": "2026-07-21T10:00:00.000Z"
      }
    }
    ```
    
    ### 오류
    
    - `400 Bad Request`: 제목 또는 내용 누락
    - `413 Payload Too Large`: 이미지 크기 초과
    - `422 Unprocessable Entity`: 이미지 개수 또는 형식 오류

---

- **PATCH `/posts/{postId}`**
    
    ### 설명
    
    작성자가 자신의 게시글을 수정한다.
    
    ### 인증
    
    필요
    
    ### 권한
    
    게시글 작성자만 가능
    
    ### Content-Type
    
    ```
    multipart/form-data
    ```
    
    ### Form Data
    
    ```
    title: 수정된 제목
    content: 수정된 내용
    existingImageUrls: 유지할 기존 이미지 주소 목록 `[string, ...]`
    newImages[image/*]: 새로 추가할 이미지 파일 목록 
    ```
    
    기존 이미지와 새 이미지를 합쳐 최대 3개까지 허용한다.
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "postId": "게시글 식별자",
        "updatedAt": "2026-07-21T11:00:00.000Z"
      }
    }
    ```
    
    ### 오류
    
    - `403 Forbidden`: 작성자가 아님
    - `404 Not Found`: 게시글 없음
    - `422 Unprocessable Entity`: 이미지 개수 또는 형식 오류

---

- **DELETE `/posts/{postId}`**
    
    ### 설명
    
    작성자가 자신의 게시글을 삭제한다.
    
    게시글 삭제 시 해당 게시글의 댓글과 북마크도 함께 삭제한다.
    
    ### 인증
    
    필요
    
    ### 권한
    
    게시글 작성자만 가능
    
    ### Response
    
    ```
    204 No Content
    ```
    
    ### 오류
    
    - `403 Forbidden`: 작성자가 아님
    - `404 Not Found`: 게시글 없음

---

- **GET `/users/me/posts`**
    
    ### 설명
    
    현재 로그인한 사용자가 작성한 게시글 목록을 조회한다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "posts": [
          {
            "postId": "게시글 식별자",
            "title": "게시글 제목",
            "viewCount": 10,
            "createdAt": "2026-07-21T10:00:00.000Z"
          }
        ]
      }
    }
    ```
    

---

# 댓글 API

- **GET `/posts/{postId}/comments`**
    
    ### 설명
    
    특정 게시글의 댓글 목록을 조회한다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "comments": [
          {
            "commentId": "댓글 식별자",
            "author": {
              "userId": "작성자 식별자",
              "loginId": "user02"
            },
            "content": "댓글 내용",
            "deletable": false,
            "createdAt": "2026-07-21T10:30:00.000Z"
          }
        ]
      }
    }
    ```
    

---

- **POST `/posts/{postId}/comments`**
    
    ### 설명
    
    특정 게시글에 댓글을 작성한다.
    
    ### 인증
    
    필요
    
    ### Request Body
    
    ```json
    {
      "content": "댓글 내용"
    }
    ```
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "commentId": "생성된 댓글 식별자",
        "postId": "게시글 식별자",
        "author": {
          "userId": "작성자 식별자",
          "loginId": "user01"
        },
        "content": "댓글 내용",
        "createdAt": "2026-07-21T10:30:00.000Z"
      }
    }
    ```
    
    ### 오류
    
    - `400 Bad Request`: 댓글 내용 누락
    - `404 Not Found`: 게시글 없음

---

- **DELETE `/comments/{commentId}`**
    
    ### 설명
    
    작성자가 자신의 댓글을 삭제한다.
    
    ### 인증
    
    필요
    
    ### 권한
    
    댓글 작성자만 가능
    
    ### Response
    
    ```
    204 No Content
    ```
    
    ### 오류
    
    - `403 Forbidden`: 댓글 작성자가 아님
    - `404 Not Found`: 댓글 없음

---

# 북마크 API

- **POST `/posts/{postId}/bookmarks`**
    
    ### 설명
    
    현재 로그인한 사용자가 게시글을 북마크한다.
    
    같은 사용자는 같은 게시글을 한 번만 북마크할 수 있다.
    
    한번 더 하면 사라진다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "postId": "게시글 식별자",
        "bookmarked": true
      }
    }
    ```
    
    ### 오류
    
    - `404 Not Found`: 게시글 없음
    - `409 Conflict`: 이미 북마크한 게시글

---

- **DELETE `/posts/{postId}/bookmarks`**
    
    ### 설명
    
    현재 로그인한 사용자의 게시글 북마크를 해제한다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```
    204 No Content
    ```
    
    ### 오류
    
    - `404 Not Found`: 게시글 또는 북마크 없음

---

- **GET `/users/me/bookmarks`**
    
    ### 설명
    
    현재 로그인한 사용자가 북마크한 게시글 목록을 조회한다.
    
    ### 인증
    
    필요
    
    ### Response
    
    ```json
    {
      "success": true,
      "data": {
        "posts": [
          {
            "postId": "게시글 식별자",
            "title": "게시글 제목",
            "authorLoginId": "user02",
            "viewCount": 20,
            "createdAt": "2026-07-21T10:00:00.000Z",
            "bookmarkedAt": "2026-07-21T11:00:00.000Z"
          }
        ]
      }
    }
    ```
    

---

# 삭제 정책

> **게시글 삭제**
> 
> 
> 게시글이 삭제되면 다음 데이터도 함께 삭제한다.
> 
> - 해당 게시글의 댓글
> - 해당 게시글의 북마크
> - 서버 또는 저장소에 등록된 게시글 이미지
> 
> MongoDB에서는 데이터베이스가 자동으로 연쇄 삭제하지 않으므로 애플리케이션 서비스 계층에서 직접 처리한다.
> 

---

# API 요약

| 기능 | Method | Endpoint |
| --- | --- | --- |
| 로그인 | POST | `/auth/login` |
| 로그아웃 | POST | `/auth/logout` |
| 로그인 사용자 확인 | GET | `/auth/me` |
| 회원가입 | POST | `/users` |
| 아이디 중복 확인 | GET | `/users/idDuplicated` |
| 이메일 중복 확인 | GET | `/users/emailDuplicated` |
| 내 정보 조회 | GET | `/users/me` |
| 내 정보 수정 | PATCH | `/users/me` |
| 회원 탈퇴 | DELETE | `/users/me` |
| 게시글 목록 | GET | `/posts` |
| 게시글 상세 | GET | `/posts/{postId}` |
| 게시글 작성 | POST | `/posts` |
| 게시글 수정 | PATCH | `/posts/{postId}` |
| 게시글 삭제 | DELETE | `/posts/{postId}` |
| 내가 작성한 글 | GET | `/users/me/posts` |
| 댓글 목록 | GET | `/posts/{postId}/comments` |
| 댓글 작성 | POST | `/posts/{postId}/comments` |
| 댓글 삭제 | DELETE | `/comments/{commentId}` |
| 북마크 등록 | POST | `/posts/{postId}/bookmarks` |
| 북마크 해제 | DELETE | `/posts/{postId}/bookmarks` |
| 내 북마크 목록 | GET | `/users/me/bookmarks` |