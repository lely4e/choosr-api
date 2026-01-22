
import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
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

  // delete poll
  // const handleDelete = async (
  //   e: React.MouseEvent,
  //   uuid: string) => {
  //   e.stopPropagation();

  //   if (!confirm("Are you sure you want to delete this poll?")) return;

  //   try {
  //     await deletePoll(uuid);
  //     navigate("/my-polls");
  //     setPolls(prev => prev.filter(poll => poll.uuid !== uuid));

  //     console.log("Poll deleted");
  //   } catch (error: any) {
  //     // alert("Server is unreachable");
  //     console.error(error.message);
  //   }
  // };


  return (
    <>
      <div className="wrap-title-poll">
        <div className="title-poll">
          <h1>My Events</h1>
          <span>View, manage, and collaborate on your polls.</span>
        </div>

        <button
          onClick={() => navigate("/add-poll")}
          className="add-poll"
        >
          Create New Event
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
                  <p className="alarm">🔗</p>
                  {/* <p className="alarm">🔔</p> */}
                  <button className="active-button">Active</button>
                </div>
              </div>
              <p className="poll-text">
                Budget: {poll.budget}$
              </p>
              <p className="deadline">🛍️ 6 options  | ⏳ 2 days left</p>

            </div>
          ))}

          <div className="card create-card" onClick={() => navigate("/add-poll")}>
            <div className="create-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="create-title">Create New Event</p>
          </div>
        </div>
      </div>

    </>
  );
};

export default Polls;

