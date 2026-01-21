import React, { useState } from "react"
// import { useNavigate } from "react-router-dom"
import { authFetch } from "../utils/auth";
import Search from "./Search";

export default function Ideas() {
    const [eventTitle, setEvent] = useState("")
    const [recipientRelation, setRecipientRelation] = useState("")
    const [recipientAge, setRecipientAge] = useState("")
    const [recipientHobbies, setRecipientHobbies] = useState("")
    const [giftType, setGiftType] = useState("")
    const [budgetRange, setBudgetRange] = useState("")
    const [data, setData] = useState<any[]>([])
    // const navigate = useNavigate()


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

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
                alert(data.detail || data.error || "Poll creating failed");
                console.error("Error by poll creating:", data);
                return;
            }

            // alert("Poll created successfully!");
            console.log("Gift suggestions:", data);

            setData(data);

            // setTimeout(() => { navigate("/my-polls") }, 1000)

        } catch (error) {
            alert("Server is unreachable");
            console.error(error);
        }
    };

    return (
        <>
        
        <div className="wrap-poll">
            
        <section>
            
            {/* <div className="card-form"> */}

            <form
                onSubmit={handleSubmit}
                className="add-poll-form"
            >
                <a href="/my-polls">Back to polls</a>
                
        <h1 className="login-h1">Gift Ideas</h1>
        <p className="account-prompt">Get the best gift suggestions</p>
                <label htmlFor="title" className="title-color">Event</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Mike's Birthday"
                    value={eventTitle}
                    onChange={(e) => setEvent(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                    className="title-form"
                    required
                />


                <label htmlFor="title" className="title-color">Recipient Relation</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Friend, Family, Colleague"
                    value={recipientRelation}
                    onChange={(e) => setRecipientRelation(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                    className="title-form"
                    required
                />

                <label htmlFor="title" className="title-color">Recipient Age</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="23"
                    value={recipientAge}
                    onChange={(e) => setRecipientAge(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                    className="title-form"
                    required
                />

                <label htmlFor="title" className="title-color">Hobbies/Interests</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Sports, Music, Art, etc."
                    value={recipientHobbies}
                    onChange={(e) => setRecipientHobbies(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                    className="title-form"
                    required
                />

                <label htmlFor="title" className="title-color">Gift Type</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Unique, Practical, Fun, etc."
                    value={giftType}
                    onChange={(e) => setGiftType(e.target.value)} // e - event (React.ChangeEvent), e.target - input element itself(type="email"), e.taget.value = current text inside the input
                    className="title-form"
                    required
                />

                <label htmlFor="title" className="title-color">Budget Range</label>
                <input
                    id="title"
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
                    >
                        Get Ideas
                    </button>

                </div>
            </form>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {data.map((idea, index) => (
                    <li key={index} style={{ marginBottom: "16px" }}>
                        <div className="card-product">
                            <div className="product-text">

                                <div className="product-title" style={{ fontWeight: "bold" }}>{idea.name}</div>
                                <div className="product-description">{idea.description}</div>
                                <div>
                                    <Search userSearch={idea.name} />
                                    {/* <input defaultValue={idea.name} /> */}
                                    {/* <button>Search</button> */}
                                    <button>Save idea for later</button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
{/* </div> */}
        </section>
        </div>
        </>
    )
}


