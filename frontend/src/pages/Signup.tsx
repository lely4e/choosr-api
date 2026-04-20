import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { signupSchema, type SignupFormErrors } from "../schemas/signUpSchema";
import { EnvelopeIcon, LockIcon, UserIcon } from "@phosphor-icons/react";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = signupSchema.safeParse({
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
    })

    if (!result.success) {
      const fieldErrors: SignupFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          username: result.data.username,
          email: result.data.email,
          password: result.data.password
        }),
      });

      const data = await response.json().catch(() => null);
      console.log(data)

      if (!response.ok) {
        // "email already exists" message
        if (data.detail?.toLowerCase().includes("email")) {
          setErrors({ email: data.detail });
        } else {
          toast.error(data.detail || "Signup failed");
        }
        return;
      }

      toast.success("User created successfully!", {
        duration: 2000,
      });
      console.log("User created successfully:", data);

      setTimeout(() => {
        navigate("/my-polls");
      }, 2000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Signup failed:", error);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-1.25 pb-0"
          >
            <h1 className="text-center mb-3 mt-5 text-[#737791] font-black text-3xl">
              Create your account
            </h1>
            <p className="flex flex-col items-center text-[12px] text-[#737791] mb-5">
              Get started in seconds
            </p>

            <div className="relative w-75 mb-3">
              <UserIcon className="absolute left-4 top-3 text-white w-4 h-4" />

              <input
                id="username"
                type="text"
                name="username"
                placeholder="username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                required
                className={`w-full h-10 bg-[#737791] text-white text-[12px] rounded-full text-center
              placeholder-[#fff1ea] placeholder:italic placeholder:font-normal
                     ${errors.username ? "border-red-400" : "border-[#737791]"}`}
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1">{errors.username}</span>
              )}

            </div>

            <div className="relative w-75 mb-3">
              <EnvelopeIcon className="absolute left-4 top-5 -translate-y-1/2 text-white w-4 h-4" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="email@example.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                className={`w-full h-10 bg-[#737791] text-white text-[12px] rounded-full
              text-center placeholder-[#fff1ea] placeholder:italic placeholder:font-normal
              ${errors.email ? "border-red-400" : "border-[#737791]"}`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email}</span>
              )}
            </div>

            <div className="relative w-75 mb-3">
              <LockIcon className="absolute left-4 top-5 -translate-y-1/2 text-white w-4 h-4" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
                className={`w-full h-10 bg-[#737791] text-white text-[12px] rounded-full
                text-center placeholder-[#fff1ea] placeholder:italic placeholder:font-normal
               ${errors.password ? "border-red-400" : "border-[#737791]"}`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password}</span>
              )}
            </div>
            <div className="p-7.5 pt-3">
              <button
                id="submitButton"
                type="submit"
                className="justify-center items-center gap-3 mx-auto w-75 h-11 bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] rounded-full text-white cursor-pointer"
              >
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
