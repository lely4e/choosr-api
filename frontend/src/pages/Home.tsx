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
                <div className="main-text-description">Create polls, share product links, and let your team vote on the best option. Perfect for event planning, team gifts, and group purchases.</div>
                <button onClick={handleCreateEvent} className="main-page-button">Create New Event</button>
            </div>

        </>
    )
}
