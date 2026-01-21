import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authFetch } from "../utils/auth";

export default function addPoll() {
  const [title, setTitle] = useState("")
  const [budget, setBudget] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

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
          console.error(error);
        }
      };
    
      return (
        <section>
          
          <form
            onSubmit={handleSubmit}
            className="add-poll-form"
          >
    <a href="/my-polls">Back to polls</a>
          <h1>Create Poll</h1>
            <label htmlFor="title" className="title-color">Title</label>
            <input
              id="title"
              type="title"
              name="title"
              placeholder="Mike's Birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
              className="title-form"
              required
            />
    
    
            <label htmlFor="budget" className="budget-color">Budget</label>
            <input
              id="budget"
              type="budget"
              name="budget"
              placeholder="300"
              value={budget}
              onChange={(e) => setBudget(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
              className="budget-form"
              required
            />
    
    
    <div className="buttons-gift-deadline">
      <button>Set Deadline</button>
      
    </div>

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
    
    
        </section>
      )
    }
    

