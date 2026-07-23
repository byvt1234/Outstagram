import { useState } from "react"
import styles from "./SignupForm.module.css"

const API_BASE_URL = "http://localhost:8080/api"

export default function SignupForm() {

    const [signupData, setSignupData] = useState({
        userId: "",
        password: "",
        passwordConfirm: "",
        emailId: "",
        emailDomain: "",
        name: "",
        nickname: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // 중복 확인 여부
    const [idChecked, setIdChecked] = useState(false)
    const [emailChecked, setEmailChecked] = useState(false)

    const getFullEmail = () => {
        const emailId = signupData.emailId.trim()
        const emailDomain = signupData.emailDomain.trim()

        if (!emailId || !emailDomain) {
            return ""
        }

        return `${emailId}@${emailDomain}`
    }

    // 입력값 변경
    const handleChange = (e) => {
        const { name, value } = e.target

        setSignupData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // 중복 확인 후 값을 변경하면 다시 중복 확인하도록 설정
        if (name === "userId") {
            setIdChecked(false)
        }

        if (name === "emailId" || name === "emailDomain") {
            setEmailChecked(false)
        }
    }

    // 아이디 중복 확인
    const handleIdCheck = async () => {
        const userId = signupData.userId.trim()

        if (!userId) {
            alert("아이디를 입력해주세요.")
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/users/idDuplicated?userid=${encodeURIComponent(userId)}`
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.message || "아이디 중복 확인 요청에 실패했습니다.")
                setIdChecked(false)
                return
            }

            /*
                서버 응답 예시
                {
                    "available": true,
                    "message": "사용 가능한 아이디입니다."
                }

                true  : 사용 가능
                false : 이미 사용 중
            */
            if (data.available) {
                alert(data.message || "사용 가능한 아이디입니다.")
                setIdChecked(true)
            } else {
                alert(data.message || "이미 사용 중인 아이디입니다.")
                setIdChecked(false)
            }
        } catch (error) {
            console.error(error)
            alert("아이디 중복 확인 중 오류가 발생했습니다.")
            setIdChecked(false)
        }
    }


    // 이메일 중복 확인
    const handleEmailCheck = async () => {
        const email = getFullEmail()

        if (!signupData.emailId.trim()) {
            alert("이메일을 입력해주세요.")
            return
        }

        if (!signupData.emailDomain.trim()) {
            alert("이메일 도메인을 입력해주세요.")
            return
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/users/emailDuplicated?email=${encodeURIComponent(email)}`
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.message || "이메일 중복 확인 요청에 실패했습니다.")
                setEmailChecked(false)
                return
            }

            /*
                서버 응답 예시
                {
                    "available": true,
                    "message": "사용 가능한 이메일입니다."
                }

                true  : 사용 가능
                false : 이미 사용 중
            */
            if (data.available) {
                alert(data.message || "사용 가능한 이메일입니다.")
                setEmailChecked(true)
            } else {
                alert(data.message || "이미 사용 중인 이메일입니다.")
                setEmailChecked(false)
            }
        } catch (error) {
            console.error(error)
            alert("이메일 중복 확인 중 오류가 발생했습니다.")
            setEmailChecked(false)
        }
    }

    // 회원가입 버튼
    const handleSubmit = async (e) => {
        e.preventDefault()

        const userId = signupData.userId.trim()
        const password = signupData.password
        const passwordConfirm = signupData.passwordConfirm
        const name = signupData.name.trim()
        const nickname = signupData.nickname.trim()
        const email = getFullEmail()

        if (!userId) {
            alert("아이디를 입력해주세요.")
            return
        }

        if (!idChecked) {
            alert("아이디 중복 확인을 해주세요.")
            return
        }

        if (!password) {
            alert("비밀번호를 입력해주세요.")
            return
        }

        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.")
            return
        }

        if (!email) {
            alert("이메일을 입력해주세요.")
            return
        }

        if (!emailChecked) {
            alert("이메일 중복 확인을 해주세요.")
            return
        }

        if (!name) {
            alert("이름을 입력해주세요.")
            return
        }

        if (!nickname) {
            alert("닉네임을 입력해주세요.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userid: userId,
                    password,
                    name,
                    nickName: nickname,
                    email,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.message || "회원가입에 실패했습니다.")
                return
            }

            if (data.token) {
                localStorage.setItem("token", data.token)
            }

            alert(data.message || "회원가입이 완료되었습니다.")
        } catch (error) {
            console.error(error)
            alert("회원가입 처리 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* 아이디 입력 */}
            <div className={styles.inputGroup}>
                <label htmlFor="userId">아이디</label>

                <div className={styles.inputRow}>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={signupData.userId}
                        onChange={handleChange}
                        placeholder="아이디를 입력하세요"
                    />

                    <button type="button" onClick={handleIdCheck}>
                        중복 확인
                    </button>
                </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className={styles.inputGroup}>
                <label htmlFor="password">비밀번호</label>

                <input
                    type="password"
                    id="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                />
            </div>

            {/* 비밀번호 확인 */}
            <div className={styles.inputGroup}>
                <label htmlFor="passwordConfirm">
                    비밀번호 확인
                </label>

                <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={signupData.passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력하세요"
                />
            </div>

            {/* 이메일 입력 */}
            <div className={styles.inputGroup}>
                <label htmlFor="emailId">이메일</label>

                <div className={styles.emailRow}>
                    <input
                        type="text"
                        id="emailId"
                        name="emailId"
                        value={signupData.emailId}
                        onChange={handleChange}
                        placeholder="이메일"
                    />

                    <span>@</span>

                    <input
                        type="text"
                        id="emailDomain"
                        name="emailDomain"
                        value={signupData.emailDomain}
                        onChange={handleChange}
                        placeholder="도메인"
                    />

                    <button type="button" onClick={handleEmailCheck}>
                        중복 확인
                    </button>
                </div>
            </div>

            {/* 이름 입력 */}
            <div className={styles.inputGroup}>
                <label htmlFor="name">이름</label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    value={signupData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                />
            </div>

            {/* 닉네임 입력 */}
            <div className={styles.inputGroup}>
                <label htmlFor="nickname">닉네임</label>

                <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={signupData.nickname}
                    onChange={handleChange}
                    placeholder="닉네임을 입력하세요"
                />
            </div>

            {/* 회원가입 버튼 */}
            <button
                className={styles.submitButton}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "처리 중..." : "회원가입"}
            </button>
        </form>
    )
}
