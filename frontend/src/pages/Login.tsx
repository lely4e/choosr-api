import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const body = new URLSearchParams({
      username: email,
      password: password
    })

    try {
      const response = await fetch("http://127.0.0.1:8000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || data.error || "Login failed")
        console.error("Login error:", data)
        return
      }

      alert("User login successfully!")
      console.log("Login successful:", data)

      // Store the access token in session storage
      sessionStorage.setItem("access_token", data.access_token)

      // Redirect to another page (React-friendly approach)
      setTimeout(() => { navigate("/my-polls") }, 1000)
    } catch (error) {
      alert("Server is unreachable")
      console.error(error)
    }
  }

  return (
    <div className="wrap-poll">
    <section>
      {/* <h1>Login</h1> */}
      <div className="card-form">
        <h1 className="login-h1">Welcome back</h1>
        <p className="account-prompt">Please sign in to continue</p>
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >

        <label htmlFor="email" className="email-color">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
          className="email-form"
          required
        />


        <label htmlFor="password" className="password-color">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-form"
          required
        />

        <div className="button-login">
          <button
            id="submitButton"
            type="submit"
            className="login"
          >
            Sign In
          </button>
          <p className="account-prompt">
            Already have an account?{" "}
            <Link to="/signup" className="login-link">
              Sign up
            </Link>
          </p>
        </div>
        
      </form>

</div>
    </section>
    </div>
  )
}
