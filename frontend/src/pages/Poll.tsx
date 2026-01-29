
import React, { useEffect, useState } from "react";
import type { Poll, Product, Comment } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deletePoll } from "../utils/deletePoll";
import { updatePoll } from "../utils/updatePoll";
// import Search from "./Search";


export default function PollPage() {
    const { uuid } = useParams<{ uuid: string }>();

    const [poll, setPoll] = useState<Poll | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);

    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [openCommentsProductId, setOpenCommentsProductId] = useState<number | null>(null);

    const [textComment, setTextComment] = useState<Record<number, string>>({});

    const navigate = useNavigate();


    const truncate = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    // fetch products
    const getProducts = async () => {
        if (!uuid) return;

        try {
            const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products`);

            const data = await response.json();

            setProducts(data);
            console.log("Products fetched:", data);
            console.log("Amount of products:", data.length)

        } catch (error) {
            // alert("Server is unreachable");
            console.error(error);
        }
    };

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



    // fetch products on mount
    useEffect(() => {
        if (!uuid) return;

        const getProducts = async () => {
            try {
                const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products`);

                const data = await response.json();

                setProducts(data);
                console.log("Products fetched:", data);
                console.log("Amount of products:", data.length)

            } catch (error) {
                // alert("Server is unreachable");
                console.error(error);
            }
        };

        getProducts();

    }, [uuid]);
    if (!poll) return <p>Loading poll...</p>;


    // delete product
    const handleDeleteProduct = async (product_id: string) => {
        try {
            const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products/${product_id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Unauthorized");
                console.error("Unauthorized:", data);
                return;
            }

            setProducts(prev => prev.filter((product: Product) => product.id !== Number(product_id)));
            console.log("Product deleted:", data);
        } catch (error) {
            // alert("Server is unreachable");
            console.error(error);
        }
    };


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

    // fetch comments
    const showComments = async (productId: number) => {
        // toggle off
        if (openCommentsProductId === productId) {
            setOpenCommentsProductId(null);
            return;
        }

        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}/comments`
            );

            const data = await response.json();

            setComments((prev: Record<number, Comment[]>) => ({
                ...prev,
                [productId]: data,
            }));

            setOpenCommentsProductId(productId);

            console.log("Amount of comments:", data.length)
        } catch (error) {
            console.error(error);
        }
    };


    const handleVote = async (productId: number, hasVoted: boolean) => {
        if (!uuid) return;

        try {
            if (hasVoted) {
                await authFetch(
                    `http://127.0.0.1:8000/${uuid}/products/${productId}/vote`,
                    { method: "DELETE" }

                ); console.log("hasVoted ->", hasVoted, "deleting vote")
            } else {
                await authFetch(
                    `http://127.0.0.1:8000/${uuid}/products/${productId}/vote`,
                    { method: "POST" }
                ); console.log("hasVoted ->", hasVoted, "adding vote")
            }

            await getProducts();

        } catch (error) {
            console.error("Vote failed:", error);
        }
    };

    const handleAddComment = async (
        productId: number
    ) => {
        if (!uuid) return;

        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}/comments`,
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: textComment[productId],
                    }),
                });

            const data = await response.json();
            if (!response.ok) {
                alert(data.detail || data.error || "Adding comment failed");
                console.error("Error by adding comment:", data);
                return;
            }

            console.log("Comment added successfully:", data);

            await getProducts();

            setComments(prev => ({
                ...prev,
                [productId]: [...(prev[productId] || []), data],
            }));

            setTextComment(prev => ({ ...prev, [productId]: "" }));


        } catch (error) {
            console.error("Error adding comment:", error);
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
                                        <p className="alarm" onClick={startEditing}>✏️</p>
                                        <p className="alarm" onClick={(e) => handleDeletePoll(e, poll.uuid)}>🗑️</p>
                                        <p className="alarm">🔗</p>
                                        <p className="alarm">🔔</p>
                                        <button className="active-button">Active</button>
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
                        <p className="deadline">🛍️ {products.length} options  | ⏳ 2 days left</p>

                    </div>
                </div>
            </div>


            <div className="poll-description">

                <h1>Products</h1>
                <div className="buttons-gift-deadline">
                    <button
                        onClick={() => navigate(`/${uuid}/search`)}
                        className="add-product"
                    >
                        Find Product
                    </button>
                    <button
                        onClick={() => navigate(`/${uuid}/ideas`)}
                    >
                        Get Gift Ideas</button>
                </div>

            </div>
            <div className="wrap-product">
                <div className="product-container">

                    {products.map(product => (
                        <div key={product.id} style={{ marginBottom: "16px" }}>
                            <div className="card-product">

                                <div className="product-image-container">
                                    <img src={product.image} alt={product.title} className="product-image" />
                                </div>

                                <div className="product-text">
                                    <div className="product-title-price">
                                        <div className="product-title">{truncate(product.title, 60)}</div>
                                        <div className="product-price">${product.price}</div>
                                    </div>

                                    <div className="product-title-price">
                                        <div className="product-rating"><div style={{ color: '#FF6A00' }}>★★★★★ </div> <strong>{product.rating}</strong> (2,345 reviews)</div>
                                        <div><strong>{product.votes} votes</strong> </div>
                                    </div>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: "40%" }}></div>
                                    </div>
                                    <div>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleVote(product.id, product.has_voted)
                                        }} className="vote">{!product.has_voted ? "Vote for This Product!" : "Voted!"}</button>
                                    </div>
                                    <div className="products-link-comments">

                                        <button onClick={() => window.open(product.link, "_blank")} className="details-button">Details</button>
                                        <button className="details-button" onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            showComments(product.id)
                                        }}>Comments ({product.comments})</button>
                                        <button onClick={() => handleDeleteProduct(String(product.id))} className="details-button">Delete</button>

                                    </div>

                                    {openCommentsProductId === product.id && (
                                        <>
                                            {comments[product.id]?.map(comment => (
                                                <div key={comment.id} className="comment">
                                                    <p style={{ color: "#737791" }}>
                                                        {comment.created_by}: "{comment.text}"
                                                    </p>
                                                </div>
                                            ))}

                                            <form
                                                className="comment-box"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddComment(product.id);
                                                }}
                                            >
                                                <textarea
                                                    value={textComment[product.id] || ""}
                                                    onChange={(e) =>
                                                        setTextComment(prev => ({
                                                            ...prev,
                                                            [product.id]: e.target.value,
                                                        }))
                                                    }
                                                />

                                                <button type="submit">Add Comment</button>
                                            </form>
                                        </>
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};


