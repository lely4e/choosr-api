
import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";

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
  const handleDelete = async (uuid: string) => {
    try {
      const response = await authFetch(`http://127.0.0.1:8000/${uuid}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unauthorized");
        console.error("Unauthorized:", data);
        return;
      }

      setPolls(prev => prev.filter(poll => poll.uuid !== uuid));
      console.log("Poll deleted:", data);
    } catch (error) {
      // alert("Server is unreachable");
      console.error(error);
    }
  };

  return (
    <>
      <h1>My Polls</h1>
      <button
        onClick={() => navigate("/add-poll")}
        className="add-poll"
      >
      Create Poll
      </button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {polls.map(poll => (
          <li key={poll.uuid} style={{ marginBottom: "16px" }}>
            <div className="card">
              <div className="poll-text">
                {poll.title} - Budget: {poll.budget}$
              </div>
              <div className="actions">
                <button className="polls-buttons" onClick={() => navigate(`/${poll.uuid}`)}>
                  Show
                </button>
                <button className="polls-buttons" onClick={() => handleDelete(poll.uuid)}>Delete</button>
                <button className="polls-buttons" onClick={() => navigate(`/update_poll/${poll.uuid}`)}>
                  Update
                </button>
                <button className="polls-buttons">Active</button>
                <button className="polls-buttons">Share</button>
              </div>
            </div>           
          </li>
        ))}
      </ul>
    </>
  );
};

export default Polls;

