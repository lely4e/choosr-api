
import React, { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deletePoll } from "../utils/deletePoll";
import { updatePoll } from "../utils/updatePoll";
import Search from "../components/Search";
import Ideas from "../components/Ideas";
import Products from "../components/Products";


export default function PollPage() {
    const { uuid } = useParams<{ uuid: string }>();

    const [poll, setPoll] = useState<Poll | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);

    const [showSearch, setShowSearch] = useState(false);
    const [showGiftIdeas, setShowGiftIdeas] = useState(false);
    const [showProducts, setShowProducts] = useState(true)


    const navigate = useNavigate();


    const handleShowSearch = () => {
        setShowSearch((prev => !prev))
        setShowGiftIdeas(false)
        setShowProducts(false)
    }

    const handleShowIdeas = () => {
        setShowSearch(false)
        setShowGiftIdeas((prev => !prev))
        setShowProducts(false)
    }

    const handleShowProducts = () => {
        setShowProducts(true)
        setShowGiftIdeas(false)
        setShowSearch(false)
    }



    // fetch polls on mount
    useEffect(() => {
        const getPoll = async () => {
            if (!uuid) return;
            try {
                const response = await authFetch(`http://127.0.0.1:8000/${uuid}`);

                const data = await response.json();

                if (!response.ok) {
                    alert(data.detail || "Unauthorized");
                    console.error("Unauthorized:", data);
                    return;
                }

                setPoll(data);
                console.log("Polls fetched:", data);
            } catch (error) {
                // alert("Server is unreachable");
                console.error(error);
            }
        };

        getPoll();
    }, [uuid]);
    if (!poll) return <p>Loading poll...</p>;


    // delete poll
    const handleDeletePoll = async (
        e: React.MouseEvent,
        uuid: string) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this poll?")) return;

        try {
            await deletePoll(uuid);
            navigate("/my-polls");

            console.log("Poll deleted");
        } catch (error: any) {
            // alert("Server is unreachable");
            console.error(error.message);
        }
    };


    // update poll
    const startEditing = () => {

        setIsEditing(true);
        setEditedTitle(poll.title);
        setEditedBudget(poll.budget);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    }

    const handleApply = async () => {
        if (!uuid) return;

        try {
            await updatePoll(uuid!, editedTitle, editedBudget);
            setPoll({ ...poll!, title: editedTitle, budget: editedBudget });
            setIsEditing(false);
            console.log("Poll updated");
        } catch (error) {
            console.error("Failed to update poll:", error);
        }
    };


    return (
        <>

            <div className="wrap-product">

                <div className="product-container">
                    <a href="/my-polls">Back to polls</a>
                    <div key={poll.uuid} className="card-poll">
                        <div className="poll-text">
                            <div className="poll-title-container">
                                <h3>
                                    {!isEditing ? (
                                        poll.title
                                    ) : (
                                        <div className="poll-apply">
                                            <input
                                                type="text"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                className="field-username"
                                            />
                                            <button onClick={handleApply} className="apply-button">Apply</button>
                                            <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                                        </div>
                                    )}
                                </h3>
                            </div>
                            <div className="alarm-text">
                                {!isEditing ? (
                                    <>
                                        <p className="alarm" onClick={startEditing}>|| ✏️</p>
                                        <p className="alarm">🔔</p>
                                        <p className="alarm" onClick={(e) => handleDeletePoll(e, poll.uuid)}>🗑️ ||</p>
                                        <button className="active-button">Active</button>
                                        <p className="alarm">🔗</p>
                                        <p className="alarm"><strong>⋮</strong></p>


                                    </>
                                ) : (
                                    <>
                                        {/* <button onClick={handleApply} className="apply-button">Apply</button>
                                        <button onClick={cancelEditing} className="cancel-button">Cancel</button> */}
                                    </>
                                )}
                            </div>

                        </div>
                        <div className="poll-budget-container">
                            <p className="poll-text">
                                Budget:&nbsp;
                                {!isEditing ? (
                                    `${poll.budget}$`
                                ) : (
                                    <input
                                        type="number"
                                        value={editedBudget}
                                        onChange={(e) => setEditedBudget(Number(e.target.value))}
                                        className="field-username"
                                    />
                                )}
                            </p>
                        </div>
                        {/* <p className="deadline">🛍️ Products: {products.length} options  | ⏳ Time left: 2 days </p> */}

                    </div>
                </div>
            </div>


            <div className="poll-description">

                <h1>Products</h1>
                <p>Add products to this poll so everyone can compare and vote.</p>
                <div className="buttons-gift-deadline">
                    <button onClick={handleShowProducts}>
                        Products
                    </button>


                    {/* <button
                        onClick={() => navigate(`/${uuid}/search`)}
                        className="add-product"
                    >
                        Search Products Navigate
                    </button> */}

                    <button
                        onClick={handleShowSearch}
                        className="add-product"
                    >
                        Search
                        {/* {!showSearch ? "Search Products" : "Hide Products"} */}
                    </button>


                    {/* <button
                        onClick={() => navigate(`/${uuid}/ideas`)}
                    >
                        Get Gift Ideas</button> */}

                    <button
                        onClick={handleShowIdeas}
                    >
                        Gift Ideas
                        {/* {!showGiftIdeas ? "Get Gift Ideas" : "Hide Gift Ideas"} */}
                    </button>

                </div>
                <div style={{ margin: 20 }}>
                    {showSearch && <Search />}
                    {showGiftIdeas && <Ideas />}
                    {/* {showProducts && <Products/>} */}
                </div>
            </div>

            {showProducts ? <Products uuid={uuid} /> : ""}


        </>
    );
};


