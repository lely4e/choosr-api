import { useState } from "react";
// import { useNavigate } from "react-router-dom"
import { authFetch } from "../utils/auth";
import Search from "./Search";
import type { GiftIdea } from "../utils/types";
// import { Link } from "react-router-dom";

export default function Ideas() {
    const [eventTitle, setEventTitle] = useState("")
    const [recipientRelation, setRecipientRelation] = useState("")
    const [recipientAge, setRecipientAge] = useState("")
    const [recipientHobbies, setRecipientHobbies] = useState("")
    const [giftType, setGiftType] = useState("")
    const [budgetRange, setBudgetRange] = useState("")
    const [ideas, setIdeas] = useState<GiftIdea[]>([])
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate()


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await authFetch('http://127.0.0.1:8000/products/suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: eventTitle,
                    recipient_relation: recipientRelation,
                    recipient_age: recipientAge,
                    recipient_hobbies: recipientHobbies,
                    gift_type: giftType,
                    budget_range: budgetRange
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || data.error || "Failed to get gift ideas");
                console.error("Error by getting gift ideas:", data);
                return;
            }

            setIdeas(data);
            console.log("Gift suggestions:", data);

        } catch (error) {
            alert("Server is unreachable");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    //   if (!localStorage.getItem("token")) {
    //     return (
    //         <div>
    //             <p>You need to be logged in.</p>
    //             <Link to="/login">log in</Link>
    //         </div>)
    // };

    return (
        <>

            <div className="wrap-poll">

                <section>
                    <form
                        onSubmit={handleSubmit}
                        className="add-poll-form"
                    >
                        {/* <a href="/my-polls">Back to polls</a> */}

                        <h1 className="login-h1">Gift Ideas</h1>
                        <p className="account-prompt">Get the best gift suggestions</p>
                        <label htmlFor="event" className="title-color">Event</label>
                        <input
                            id="event"
                            type="text"
                            name="title"
                            placeholder="Mike's Birthday"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />


                        <label htmlFor="relation" className="title-color">Recipient Relation</label>
                        <input
                            id="relation"
                            type="text"
                            name="title"
                            placeholder="Friend, Family, Colleague"
                            value={recipientRelation}
                            onChange={(e) => setRecipientRelation(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />

                        <label htmlFor="age" className="title-color">Recipient Age</label>
                        <input
                            id="age"
                            type="text"
                            name="title"
                            placeholder="23"
                            value={recipientAge}
                            onChange={(e) => setRecipientAge(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />

                        <label htmlFor="interests" className="title-color">Hobbies/Interests</label>
                        <input
                            id="interests"
                            type="text"
                            name="title"
                            placeholder="Sports, Music, Art, etc."
                            value={recipientHobbies}
                            onChange={(e) => setRecipientHobbies(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />

                        <label htmlFor="gift-type" className="title-color">Gift Type</label>
                        <input
                            id="gift-type"
                            type="text"
                            name="title"
                            placeholder="Unique, Practical, Fun, etc."
                            value={giftType}
                            onChange={(e) => setGiftType(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />

                        <label htmlFor="budget-range" className="title-color">Budget Range</label>
                        <input
                            id="budget-range"
                            type="text"
                            name="title"
                            placeholder="350-400"
                            value={budgetRange}
                            onChange={(e) => setBudgetRange(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                            className="title-form"
                            required
                        />

                        <div className="button-signup">
                            <button
                                id="submitButton"
                                type="submit"
                                className="signup"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Get Ideas"}
                            </button>

                        </div>
                    </form>
                    <h1 className="login-h1" style={{ margin: "30px" }}>Gift suggestions</h1>
                    {/* <ul style={{ listStyle: "none", padding: 0 }}> */}
                    {ideas.map((idea, index) => (
                        <div key={index} style={{ marginBottom: "16px" }}>

                            <div className="card-product">
                                <div className="idea-text">
                                    {/* <div className="search-save-buttons"> */}
                                        
                                        {/* <input id="search" className="search-product" type="text" value={idea.name} />
                                        <button>Search</button>
                                        <button>Save</button> */}

                                        <Search userSearch={idea.name} />
                                        


                                    {/* </div> */}
                                    <div className="product-description">{idea.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                 
                </section>
            </div>
        </>
    )
}


