import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authFetch } from "../utils/auth";

export default function addPoll() {
  const [title, setTitle] = useState("")
  const [budget, setBudget] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // prevent refreshing page

    try {
      const response = await authFetch('http://127.0.0.1:8000/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      setTimeout(() => { navigate("/my-polls") }, 1000)

    } catch (error) {
      alert("Server is unreachable");
      console.error("Error adding poll:", error);
    }
  };

  return (
    <div className="wrap-poll">
    <section>
<div className="card-form">
      <form
        onSubmit={handleSubmit}
        className="add-poll-form"
      >
        {/* <a href="/my-polls">Back to polls</a> */}
        <h1 className="login-h1">Create Poll</h1>
        <p className="account-prompt">Set up your poll in a few steps</p>
        <label htmlFor="title" className="title-color">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Mike's Birthday"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          className="title-form"
          required
        />


        <label htmlFor="budget" className="budget-color">Budget</label>
        <input
          id="budget"
          type="number"
          name="budget"
          placeholder="300"
          value={budget}
          onChange={(e) => setBudget(e.target.value)} 
          className="budget-form"
          required
        />


        {/* <div className="buttons-gift-deadline">
          <button>Set Deadline</button>

        </div> */}

        <div className="button-signup">
          <button
            id="submitButton"
            type="submit"
            className="signup"
          >
            Create Poll
          </button>

        </div>
      </form>

</div>
    </section>
    </div>
  )
}


