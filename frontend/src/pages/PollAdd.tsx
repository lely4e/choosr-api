import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";
import { Clock, Dot, Share2, ShoppingBagIcon } from "lucide-react";

export default function addPoll() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
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
          ...(description && { description }),
          ...(deadline && { deadline }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error to add poll:", data);
        toast.error("Error to add poll");
        return;
      }

      console.log("Poll created successfully:", data);
      toast.success("Poll created successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/my-polls");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error to add poll: ${error.message}`);
        console.error(`Error to add poll: ${error.message}`);
      } else {
        toast.error("Error to add poll!");
        console.error("Error to add poll!", error);
      }
    }
  }

  return (
    <>
      {/* wrap-title-poll */}
      <div className="flex items-center">
        <div className="flex justify-between items-center mr-5"></div>

        {/* wrap-poll */}
        <div className="mx-auto flex px-4 justify-center">
          {/* poll-grid */}

          <div className="gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <form onSubmit={handleSubmit}>
              <div
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
              >
                {/* poll-text */}
                <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                  {/* active-button */}
                  <button
                    className="bg-green-300/50 rounded-[20px] inline-flex items-center justify-center px-2 py-1 text-[0.7rem] 
                  h-5 text-[#356d8a] border-none opacity-40"
                  >
                    Active
                  </button>
                  <Share2 size={20} strokeWidth={1.5} className="opacity-40" />
                </div>
                {/* poll-text */}
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Mike's Birthday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-left m-0 font-bold text-3xl text-black "
                  required
                />

                <div className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">
                  {/* Budget: budget $ */}

                  <label htmlFor="budget" className="text-black ">
                    Budget $
                  </label>
                  <input
                    id="budget"
                    type="number"
                    name="budget"
                    placeholder="300"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="flex-1  text-sm text-black"
                    required
                  />
                </div>

                <input
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Here is a short description you could add to your poll"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex text-left  mt-2.5 text-sm text-[#737791] font-serif italic pt-1 pb-1"
                />

                {/* deadline */}
                <p className="flex items-center mt-8 mb-5 gap-2 ml-0 text-[12px] text-[#EA7317] opacity-40">
                  <ShoppingBagIcon size={14} strokeWidth={1.5} /> 4 items
                  <span>
                    <Dot className="mx-1" color="#F25E0D" size={14} />
                  </span>
                  <Clock size={14} strokeWidth={1.5} />
                  <input
                    id="date"
                    type="date"
                    name="date"
                    placeholder="Date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="flex text-left text-sm text-[#737791] font-serif italic pt-1 pb-1"
                  />
                </p>

                <div className=" flex pt-3">
                  <button
                    id="submitButton"
                    type="submit"
                    className="justify-center items-center  mx-auto w-full h-12 bg-[#F25E0D] rounded-3xl text-white cursor-pointer"
                  >
                    Create Poll
                  </button>
                </div>
              </div>

              {/* create-card */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
