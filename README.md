# Outstagram
> 로그인, 게시글, 댓글 기능이 있는 게시판 프로젝트입니다.

last update: `2026-07-22 12:54:30`

## 팀원
| 이름 | 역할                                        | 
|---|---------------------------------------------|
| 박건희 | 팀장, UI 디자인                             |
| 심형준 | 팀원, UI 디자인                             |
| 윤재빈 | 팀원, UI 디자인                             |
| 양수연 | 팀원, UI 디자인                             |
| 최한빈 | 팀원, UI 디자인                             |
| 허완 | 팀원, API명세, 프로젝트 구조 초기화 및 설계 |

## 주요 기능


## Demo


## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- ODM: Mongoose
- Auth: Bearer JWT

## Architecture


## Project Structure

- `Client/`: 프론트 프로젝트 
- `Server/`: 노드 서버 프로젝트
  - `Server/01_router`: API 라우터
  - `Server/02_middleware`: 인증, 업로드 미들웨어
  - `Server/03_controller`: 요청/응답 처리
  - `Server/04_service`: 비즈니스 로직
  - `Server/05_data`: DB 접근 함수
  - `Server/101_db`: Database Connect
  - `Server/102_utils`: 로깅, 날짜, 코드 기타 함수
  - `Server/103_models`: Mongoose Schema
- `docs/`: 요구사항 및 API 명세, 개발 기록

## Docs

- [API]
- [Database]
- [API]

## How to execute
 ```bash
cd Server
npm install
npm run dev

## Environment Variables

.env.example을 참고해서 Server/.env를 생성합니다.

JWT_SECRET=
JWT_EXPIRES_SEC=
BCRYPT_SALT_ROUNDS=
HOST_PORT=
HOST_ADDRESS=
DB_HOST=
MULTER_UPLOAD_DIR=
```

## Timeline
- [`2026-07-21`]
  - API, Database, 기능 명세 작성
  - 프로젝트 구조 및 Git 준비
  - Figma UI 프로토타이핑
- [`2026-07-22`]
  - 프로젝트 초기화 완료 및 [Git Repository](https://github.com/hurwan0629/Outstagram) 생성 