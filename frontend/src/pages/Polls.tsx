import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Share2, ShoppingBagIcon, Clock, Dot } from "lucide-react"

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await authFetch("http://127.0.0.1:8000/polls");
        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "Unauthorized");
          console.error("Unauthorized:", data);
          return;
        }

        setPolls(data);
        console.log("Polls fetched:", data);
      } catch (error) {
        console.error(error);
      }
    };

    getPolls();
  }, []);

  return (
    <>
      {/* wrap-title-poll */}
      <div className="flex justify-between items-center mr-5">
        <div>
          <h1 className="text-left px-5 text-[1.5em] leading-[1.1]  mb-2 mt-16">
            Your Polls
          </h1>
          <span className="m-5 text-left text-[#737791]">
            View, manage, and collaborate on your polls.
          </span>
        </div>

        {/* <button
          onClick={() => navigate("/add-poll")}
          className="flex items-center text-white bg-[#F25E0D] rounded-[10px] w-[200px] h-[44px] justify-center" 
        >
          <Plus size={20} strokeWidth={2} className="mr-1.5 text-white" />
          Create Poll
        </button> */}
      </div>

      {/* wrap-poll */}
      <div className="mx-auto flex px-4 justify-center">

        {/* poll-grid */}
        <div className="grid gap-6 w-full my-10 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4">


          {polls.map(poll => (
            // card 
            <div
              key={poll.uuid}
              className="box-content bg-white/[0.439] backdrop-blur-[10px] rounded-[30px] p-6 cursor-pointer 
              flex flex-col shadow-[0_-1px_25px_rgba(0,0,0,0.1)] transition-all duration-250 ease-in-out h-full 
              hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
              onClick={() => navigate(`/${poll.uuid}`)}
            >
              {/* poll-text */}
              {/* <div className="flex justify-between items-start gap-5 m-0 text-[rgb(95,89,101)]"> */}


              {/* alarm-text */}
              <div className="pb-2.5 flex justify-between items-start gap-5 m-0">
                {/* active-button */}
                <button className="bg-green-300/50 rounded-[20px] inline-flex items-center justify-center px-2 py-1 text-[0.7rem] 
                  h-5 text-[#356d8a] border-none">
                  Active
                </button>
                <Share2 size={20} strokeWidth={1.5} />
              </div>
              {/* </div> */}

              <h3 className="text-left m-0 font-bold text-3xl text-black">{poll.title}</h3>
              {/* poll-text */}
              <p className="flex justify-between items-start gap-5 mt-2.5 text-sm text-black">
                Budget: {poll.budget}$
              </p>

              {/* poll-description */}
              <p className="flex text-left  mt-2.5 text-sm text-[#737791]">
                Here will be a short description that you could add to your poll
              </p>

              {/* deadline */}
              <p className="flex items-center mt-auto mb-5 gap-2 ml-0 text-[12px] text-[#EA7317]">
                <ShoppingBagIcon size={14} strokeWidth={1.5} /> 6 options
                <span ><Dot className="mx-1" color="#F25E0D" size={14} /></span>
                <Clock size={14} strokeWidth={1.5} /> 2 days
              </p>
            </div>
          ))}

          {/* create-card */}
          <div
            className="h-full box-content bg-white/[0.439] backdrop-blur-[10px] border-2 border-dashed 
            border-[#cbd5f5] rounded-[30px] p-6 flex flex-col items-center justify-center cursor-pointer 
            transition-all duration-250 hover:border-[#F25E0D] hover:bg-[rgba(246,143,92,0.05)]"
            onClick={() => navigate("/add-poll")}
          >
            {/* create-icon */}
            <div className="w-14 h-14 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[#9496b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {/* create-title */}
            <p className=" text-slate-600 mb-1 text-sm">Create Poll</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Polls;