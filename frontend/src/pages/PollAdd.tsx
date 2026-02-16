import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

export default function addPoll() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent refreshing page

    try {
      const response = await authFetch("http://127.0.0.1:8000/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          budget: budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.error || "Poll creating failed");
        console.error("Error by poll creating:", data);
        return;
      }

      alert("Poll created successfully!");
      console.log("Poll created successfully:", data);

      setTimeout(() => {
        navigate("/my-polls");
      }, 1000);
    } catch (error) {
      alert("Server is unreachable");
      console.error("Error adding poll:", error);
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
            {/* <a href="/my-polls">Back to polls</a> */}
            <h1 className="text-center mb-3 mt-2 text-[#737791] font-black text-3xl">
              Create Poll
            </h1>
            <p className="flex flex-col items-center text-[12px] text-[#737791]">
              Set up your poll in a few steps
            </p>
            <label htmlFor="title" className="text-[#737791] pt-5">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Mike's Birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex w-75 h-10 bg-[#737791] text-white text-center text-[12px] rounded-[10px]
              placeholder-[#fff1ea] placeholder-italic placeholder-font-normal placeholder-opacity-100 placeholder:text-center"
              required
            />

            <label htmlFor="budget" className="text-[#737791] pt-3">
              Budget
            </label>
            <input
              id="budget"
              type="number"
              name="budget"
              placeholder="300"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex w-75 h-10 bg-[#737791] text-white text-center text-[12px] rounded-[10px]
              placeholder-[#fff1ea] placeholder-italic placeholder-font-normal placeholder-opacity-100 placeholder:text-center"
              required
            />

            {/* <div className="buttons-gift-deadline">
          <button>Set Deadline</button>

        </div> */}

            <div className="p-7.5 pt-5">
              <button id="submitButton" 
              type="submit" 
              className="justify-center items-center gap-3 mx-auto w-75 h-11 bg-[#F25E0D] rounded-[10px] text-white cursor-pointer">
                Create Poll
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
