
import { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import type { Product } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deletePoll } from "../utils/deletePoll";
import { updatePoll } from "../utils/updatePoll";


export default function PollPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedBudget, setEditedBudget] = useState<number>(0);

    const navigate = useNavigate();


    const truncate = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
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
        const getProducts = async () => {
            try {
                const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products`);

                const data = await response.json();

                setProducts(data);
                console.log("Products fetched:", data);
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

        if (!confirm("Are you sure you want to delete this poll?")) return;

        try {
            await deletePoll(uuid);
            navigate("/my-polls");

            console.log("Poll deleted");
        } catch (error: any) {
            // alert("Server is unreachable");
            console.error(error.message);
        }
    };



    const startEditing = () => {
        setIsEditing(true);
        setEditedTitle(poll.title);
        setEditedBudget(poll.budget);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    }

    // update poll
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
            <a href="/my-polls">Back to polls</a>

            <div className="wrap-product">
                <div className="product-container">

                    <div key={poll.uuid} className="card">
                        <div className="poll-text">
                            <div className="poll-title-container">
                            <h3>
                                {!isEditing ? (
                                    poll.title
                                ) : (
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="edit-input"
                                    />
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
                                        <button onClick={handleApply} className="apply-button">Apply</button>
                                        <button onClick={cancelEditing} className="cancel-button">Cancel</button>
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
                                    className="edit-input"
                                />
                            )}
                        </p>
                        </div>
                        <p className="deadline">🛍️ 6 options  | ⏳ 2 days left</p>

                    </div>
                </div>
            </div>

            
            <div className="poll-description">
                
                <h1>Products</h1>
                <div className="buttons-gift-deadline">
                    <button
                        onClick={() => navigate("/search")}
                        className="add-product"
                    >
                        Add Product
                    </button>
                    <button
                        onClick={() => navigate("/ideas")}>Get Gift Ideas</button>
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

                                    <div className="product-rating"><div style={{ color: '#FF6A00' }}>★★★★★ </div> <strong>{product.rating}</strong> (2,345 reviews)</div>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: "40%" }}></div>
                                    </div>
                                    <div>
                                        <button className="vote">Vote!</button>
                                    </div>
                                    <div className="products-link-comments">

                                        <button onClick={() => navigate(product.link)} className="details-button">Details</button>
                                        <button className="details-button">Comments (0)</button>
                                        <button onClick={() => handleDeleteProduct(String(product.id))} className="details-button">Delete</button>

                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};


