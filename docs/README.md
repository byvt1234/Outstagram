# Git 작업 규칙
## 브랜치
해당 깃 레포에는 `main`, `develop`, `feature/[own_name]` 로 이루어져 있으며 모든 기능 개발은 `feature/[own_name]`에서 작업되며 Pull Request 이후 `develop` 및 `main` 브랜치에 추가 됩니다.


# 코드 작업
## Controller
- 필수 입력값 및 누락 여부를 확인하기
- 올바른 status 반환
- DB 쿼리작업 없이 `mongoose`만을 이용해서 작업
- 에러는 `throw new ApiError()` 사용하여 처리
## Service
- 실제 비즈니스 로직 담당
- `ObjectId` 유효성 검사
- 실질적으로 `Repository` 사용 계층
## Repository
- 필요에 따라 `mongoose.session`를 사용할 수 있게 합니다.
- 되도록 JSDoc를 작성하기