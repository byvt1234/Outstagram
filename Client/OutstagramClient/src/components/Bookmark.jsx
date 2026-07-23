
export default function Bookmark({ active }) {
  return (<h1>{
    active 
    ? "북마크 됨🟢"
    : "북마크 안됨🔴"
  }</h1>)
}