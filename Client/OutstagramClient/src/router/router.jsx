import { createBrowserRouter } from "react-router"
import MainLayout from "../layout/MainLayout"
import constRole from "./role"
import Auth from "./Auth"
import LandingPage from "../pages/LandingPage"
import SigninPage from "../pages/SigninPage"
import MainPage from "../pages/MainPage"
import UserEditPage from "../pages/UserEditPage"
import MyPage from "../pages/MyPage"
import PostWritePage from "../pages/PostWritePage"
import PostDetailPage from "../pages/PostDetailPage"
import NotFoundPage from "../pages/error/NotFoundPage"
import ErrorPage from "../pages/error/ErrorPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // 최초 랜딩 + 로그인 페이지
      {
        index: true,
        element: (
          <Auth role={constRole.GUEST}>
            <LandingPage />
          </Auth>
        )
      },
      // 회원가입 페이지
      {
        path: "/signin",
        element: (
          <Auth role={constRole.GUEST}>
            <SigninPage />
          </Auth>
        )
      },
      // 메인 페이지
      {
        path: "/main",
        element: (
          <Auth role={constRole.LOGIN}>
            <MainPage />
          </Auth>
        )
      },
      {
        path: "/post/:postId",
        element: (
          <Auth role={constRole.LOGIN}>
            <PostDetailPage />
          </Auth>
        )
      },
      {
        path: "/mypage",
        element: (
          <Auth role={constRole.LOGIN}>
            <MyPage />
          </Auth>
        )
      },
      {
        path: "/edit",
        element: (
          <Auth role={constRole.LOGIN}>
            <UserEditPage />
          </Auth>
        )
      },
      {
        path: "/write",
        element: (
          <Auth role={constRole.LOGIN}>
            <PostWritePage />
          </Auth>
        )
      },
      {
        path: "/*",
        element: (
          <Auth role={constRole.PUBLIC}>
            <NotFoundPage />
          </Auth>
        )
      }
    ]
  }
])