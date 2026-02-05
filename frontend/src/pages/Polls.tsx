import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Share2, ShoppingBagIcon, Clock, Plus } from "lucide-react"
// import { deletePoll } from "../utils/deletePoll";

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);


  const navigate = useNavigate();


  // fetch polls on mount
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
        // alert("Server is unreachable");
        console.error(error);
      }
    };

    getPolls();
  }, []);

  return (
    <>
      {/* <div className="flex justify-between items-center mr-5">  */}
        <div className="wrap-title-poll">
        <div>
          <h1 
          className="text-left px-5 text-[2em] leading-[1.1] font-bold mb-2 mt-6"
          >Your Polls</h1>
          <span className="m-5 text-left text-[#737791]">View, manage, and collaborate on your polls.</span>
        </div>

        <button
          onClick={() => navigate("/add-poll")}
          className="flex text-white items-center"
        >
          <Plus size={20} strokeWidth={2} style={{ marginRight: "6px", color: "white" }} />Create Poll
        </button>
      </div>

      {/* <div className="mx-auto flex px-4 justify-center">  */}
        <div className="wrap-poll"> 
        {/* <div 
        className="grid gap-6 w-full my-10 mx-auto 
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-3
            auto-rows-fr">  */}
            <div
            className="poll-grid">
            
          {polls.map(poll => (
            <div key={poll.uuid}
            className="card"
          //     className="bg-white/50 backdrop-blur-[10px] rounded-[30px] p-6 cursor-pointer flex flex-col 
          //  shadow-[0_10px_25px_rgba(0,0,0,0.157),0_4px_10px_rgba(0,0,0,0.04),0_-1px_25px_rgba(0,0,0,0.1)] 
          //  transition-shadow duration-250 ease-in-out h-full 
           
          //  hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"

              onClick={() => navigate(`/${poll.uuid}`)}> {/* "card" */}
              {/* <div className="flex justify-between items-start gap-5 text-left text-[rgb(95,89,101)]">  */}
                <div className="poll-text">
                <h3 
                // className="text-left m-0 font-bold"
                >{poll.title}</h3>
                {/* <div className="p-1.5 flex justify-between items-start gap-5 m-0">  */}
                  <div className="alarm-text"> 
                  <button className="active-button">Active</button>
                  <Share2 size={20} strokeWidth={1.5} />

                </div>
              </div>
              <p className="poll-text"> {/* "poll-text" */}
                Budget: {poll.budget}$
              </p>
              {/* <p className="flex items-center mt-auto mb-5 ml-0 gap-2.5 pb-0" >  */}
                <p className="deadline" >
                <ShoppingBagIcon size={14} strokeWidth={1.5} /> Products: 6 options
                <span style={{ margin: "0 4px", color: "#F25E0D" }}>·</span>
                <Clock size={14} strokeWidth={1.5} /> Time Left: 2 days
              </p>
            </div>
          ))}

          <div className="card create-card" onClick={() => navigate("/add-poll")}>
            <div className="create-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="create-title">Create Poll</p>
          </div>
        </div>
      </div>

    </>
  );
};

export default Polls;

