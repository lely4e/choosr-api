import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { pollSchema, type PollFormErrors } from "../schemas/pollSchema";
import { ClockIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";


export default function PollAdd() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState<PollFormErrors>({});

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = pollSchema.safeParse({
      title: title,
      budget: Number(budget),
      description: description || undefined,
      deadline: deadline || undefined,
    })

    if (!result.success) {
      const fieldErrors: PollFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PollFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});

    try {
      const response = await authFetch(`${API_URL}/polls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.data.title,
          budget: result.data.budget,
          description: result.data.description,
          deadline: result.data.deadline,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.detail || "Error creating poll");
        console.error("Error creating poll:", data);
        return;
      }

      console.log("Poll created successfully:", data);
      toast.success("Poll created successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/my-polls");
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      console.error("Error creating poll:", error);
    }
  }

  return (
    <>
      {/* wrap-title-poll */}
      <motion.div className="flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.6 }}>
        <div className="flex justify-between items-center mr-5"></div>

        {/* wrap-poll */}
        <div className="mx-auto flex px-4 justify-center">
          {/* poll-grid */}

          <div className="gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <form onSubmit={handleSubmit}>
              <div
                className="box-content bg-white/50 backdrop-blur-md rounded-[30px] p-6 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
              >

                {/* poll-text */}
                <div className="grid">
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Mike's Birthday"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`text-left m-0 font-bold text-3xl text-black 
                       ${errors.title ? "border-b border-red-400" : "border-[#737791]"}`}
                  />
                  {errors.title && (
                    <span className="text-red-500 text-xs mt-1">{errors.title}</span>
                  )}
                </div>
                <div className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">

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
                    required
                    className={`flex-1  text-sm text-black
                   ${errors.budget ? "border-b border-red-400" : "border-[#737791]"}`}
                  />

                </div>
                {errors.budget && (
                  <span className="text-red-500 text-xs mt-1">{errors.budget}</span>
                )}

                <div className="flex w-full">
                  <input
                    id="description"
                    type="text"
                    name="description"
                    placeholder="Here is a short description you could add to your poll"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`flex w-full text-left  mt-2.5 text-sm text-[#737791] font-serif italic pt-1 pb-1
                  ${errors.description ? "border-b border-red-400" : "border-[#737791]"}`}
                  />

                </div>
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                )}
                {/* deadline */}
                <div>
                  <div className="flex items-center mt-8 mb-5 gap-2 ml-0 text-[12px] text-[#EA7317]">
                    <ClockIcon size={14} strokeWidth={1.5} />
                    <input
                      id="date"
                      type="date"
                      name="date"
                      placeholder="Date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className={`date-icon flex text-left text-sm text-[#737791] font-serif italic pt-1 pb-1
                    ${errors.deadline ? "border-red-400" : "border-[#737791]"}`}
                    />
                    {errors.deadline && (
                      <span className="text-red-500 text-xs mt-1">{errors.deadline}</span>
                    )}
                  </div>
                </div>
                <div className="flex pt-3">
                  <button
                    id="submitButton"
                    type="submit"
                    className="justify-center items-center  mx-auto w-full h-12 bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] rounded-3xl text-white cursor-pointer"
                  >
                    Create Poll
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
}
