import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()

    const handleCreateEvent = () => {
        if (localStorage.getItem("token")) {
            navigate("/login")
        } else {
            navigate("/add-poll")
        };
    }

    return (
        <>

            <div className="wrap-home">
                <h1 className="main-text">Make Group Decisions<div style={{ color: '#FF6A00' }}>Effortlessly</div></h1>
                <p className="main-text-description">Create polls, share product links, and let your team vote on the best option. Perfect for event planning, team gifts, and group purchases.</p>
                <button onClick={handleCreateEvent} className="main-page-button">Create Your First Poll</button>
                <h2>How it works</h2>

                <h3>Create a poll - Share with others - Decide together</h3>

                <p>Add options or products in seconds - Invite friends or teammates to vote - See results and comments in real time</p>
                <h2>Use cases</h2>
                <h3>
                    🎉 Event planning

                    🎁 Group gifts

                    🛍️ Shared purchases

                    👥 Team decisions
                </h3>


            </div>


        </>
    )
}
