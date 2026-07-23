import SignupForm from "../../components/signup/SignupForm"
import styles from "./Signup.module.css"

export default function Signup() {
    return (
        <main className={styles.page}>
            {/* 현재 페이지 정보 */}
            <p className={styles.path}>
                회원가입 페이지 /signup
            </p>

            {/* 회원가입 페이지 영역 */}
            <section className={styles.container}>
                <h1 className={styles.title}>회원가입</h1>

                <SignupForm />
            </section>
        </main>
    )
}