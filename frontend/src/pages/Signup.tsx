import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
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

      setTimeout(() => {
        navigate("/my-polls");
      }, 1000);
    } catch (error) {
      alert("Server is unreachable");
      console.error(error);
    }
  }

  return (
    <div className="mx-auto flex p-4 justify-center">
      <section>
        <div
          className="w-100 p-6 flex flex-col rounded-[30px]
            bg-[#eaf0ff97] backdrop-blur-[20px] 
            shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
            transition-transform duration-250 ease-in-out
            hover:translate-y-1
            hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-1.25 pb-0">
            <h1 className="text-center mb-3 mt-2 text-[#737791] font-black text-3xl">
              Create your account
            </h1>
            <p className="flex flex-col items-center text-[12px] text-[#737791]">Get started in seconds</p>

            <label htmlFor="username" className="text-[#737791] pt-5">
              Username
            </label>
            <input
              id="username"
              type="username"
              name="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
              className="flex w-75 h-10 bg-[#737791] text-white text-center text-[12px] rounded-[10px]
              placeholder-[#fff1ea] placeholder-italic placeholder-font-normal placeholder-opacity-100 placeholder:text-center"
              required
            />

            <label htmlFor="email" className="text-[#737791] pt-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
              className="flex w-75 h-10 bg-[#737791] text-white text-center text-[12px] rounded-[10px]
              placeholder-[#fff1ea] placeholder-italic placeholder-font-normal placeholder-opacity-100 placeholder:text-center"
              required
            />

            <label htmlFor="password" className="text-[#737791] pt-3">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex w-75 h-10 bg-[#737791] text-white text-center text-[12px] rounded-[10px]
              placeholder-[#fff1ea] placeholder-italic placeholder-font-normal placeholder-opacity-100 placeholder:text-center"
              required
            />

            <div className="p-7.5 pt-5">
              <button id="submitButton" type="submit" className="justify-center items-center gap-3 mx-auto w-75 h-11 bg-[#F25E0D] rounded-[10px] text-white cursor-pointer">
                Signup
              </button>
              <p className="flex flex-col items-center text-[12px] text-[#737791] pt-7.5">
                Already have an account?{" "}
                <Link to="/login" className="text-[#F25E0D]">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
