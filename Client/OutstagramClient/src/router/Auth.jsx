import { useEffect, useState } from "react"
import constRole from "./role"
import apiFetch from "../api/apiClient"
import { Outlet, useNavigate } from "react-router"

export default function Auth({ role, children }) {
  const [checking, setChecking] = useState(true) 
  const [userLogin, setUserLogin] = useState(false)
  
  // 토큰이 존재한다면 서버에 요청해보기
  const navigate = useNavigate();


  // 현재 localStorage의 token 값을 읽어서
  //  role == role.LOGIN 이면 존재 해야 렌더링
  //  role == role.GUEST 이면 존재하지 않아야 렌더링
  //  role == role.PUBLIC 이면 뭐든 상관 없이 작성

  // 그런데 토큰은 있는데 만료된 jwt일 수도 있으므로 한번 /api/auth/me 요청해주기

  // 컴포넌트에 async를 사용할 순 없기 때문에 useEffect를 사용하기
  useEffect( () => {
    // 요청해보기
    async function checkUserLogin() {
      try {
        const response = await apiFetch({ path: "/auth/me", options: { method: "GET" } })
  
        if(!response.ok) {
          setUserLogin(false)
        }
        if(response.status === 200) {
          setUserLogin(true)
        }
      } catch (error) {
        setUserLogin(false)
      } finally {
        setChecking(false)
      }
    }

    checkUserLogin()
  }, [])

  useEffect(() => {
    // 확인중이면 결과 산출 기다리기
    if(checking) {
      return 
    }
    // 게스트여야하는 경우  로그인되어있거나
    if (role == constRole.GUEST && userLogin) {
      // 메인으로 보내기
      navigate("/main", { replace: true })
    }
    // 로그인 상태여야하는 경우 로그아웃되어있으면 내보내기
    else if (role == constRole.LOGIN && !userLogin) {
      navigate("/", { replace: true })
    }

    // 상관 없을 때
    else if (role == constRole.PUBLIC) {
      // 아무것도 하지 않기
    }
  }, [checking, role, userLogin, navigate])

  // 로딩중이면 기다리기
  if (checking) {
    return null
  }

  // 자식 컴포넌트가 있으면 출력해주기
  if(children) {
    return children
  }

  return (
    <Outlet />
  )
  
}