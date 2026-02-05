import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // "email already exists" message
        alert(data.detail || data.error || "Signup failed");
        console.error("Signup error:", data);
        return;
      }

      alert("User signed up successfully!");
      console.log("Signup successful:", data);

      setTimeout(() => { navigate("/my-polls") }, 1000)

    } catch (error) {
      alert("Server is unreachable");
      console.error(error);
    }
  };

  return (
    <div className="wrap-poll">
    <section>
      <div className="card-form">
             <h1 className="login-h1">Create your account</h1>
        <p className="account-prompt">Get started in seconds</p>
      <form
        onSubmit={handleSubmit}
        className="signup-form"
      >

        <label htmlFor="username" className="username-color">Username</label>
        <input
          id="username"
          type="username"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
          className="username-form"
          required
        />


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

        <div className="button-signup">
          <button
            id="submitButton"
            type="submit"
            className="signup"
          >
            Signup
          </button>
          <p className="account-prompt">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>

</div>
    </section>
    </div>
  )
}
