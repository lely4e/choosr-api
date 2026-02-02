import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Share2, ShoppingBagIcon, Clock, CheckCircle, Plus } from "lucide-react"
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
      <div className="wrap-title-poll">
        <div className="title-poll">
          <h1>Your Polls</h1>
          <span>View, manage, and collaborate on your polls.</span>
        </div>

        <button
          onClick={() => navigate("/add-poll")}
          className="add-poll"
          style={{
            display: "flex"
          }}
        >
          <Plus size={20} strokeWidth={2} style={{ marginRight: "6px" }} />Create Poll
        </button>
      </div>

      <div className="wrap-poll">
        <div className="poll-grid">
          {polls.map(poll => (
            <div key={poll.uuid} className="card" onClick={() => navigate(`/${poll.uuid}`)}>
              <div className="poll-text">
                <h3>{poll.title}</h3>
                <div className="alarm-text">
                  {/* <p className="alarm">✏️</p> */}
                  {/* <p className="alarm" onClick={(e) => handleDelete(e, poll.uuid)}>🗑️</p> */}
                  <button className="active-button"><CheckCircle size={10} strokeWidth={1.5} color="#356d8a" style={{ marginRight: "6px" }} />Active</button>
                  {/* <CheckCircle size={14} strokeWidth={1.5} color="#16a34a" />
                  <Circle size={10} fill="#16a34a" /> */}
                  <Share2 size={20} strokeWidth={1.5} />
                  {/* <p className="alarm">🔗</p> */}
                  {/* <p className="alarm">🔔</p> */}

                </div>
              </div>
              <p className="poll-text">
                Budget: {poll.budget}$
              </p>
              <p className="deadline" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

