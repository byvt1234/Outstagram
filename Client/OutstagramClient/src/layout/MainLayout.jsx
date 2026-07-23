import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <h1>메인 레이아웃</h1>
      {/* <Header /> */}
      <Outlet />
    </div>
  )
}