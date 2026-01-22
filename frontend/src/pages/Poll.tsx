
import { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import type { Product } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deletePoll } from "../utils/deletePoll";


export default function PollPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
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

    if (!poll) return <p>Loading poll...</p>;

    // delete poll
    const handleDelete = async (
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


    return (
        <>
            <a href="/my-polls">Back to polls</a>

            <div className="wrap-product">
                <div className="product-container">

                    <div key={poll.uuid} className="card">
                        <div className="poll-text">
                            <h3>{poll.title}</h3>
                            <div className="alarm-text">
                                <p className="alarm">✏️</p>
                                <p className="alarm" onClick={(e) => handleDelete(e, poll.uuid)}>🗑️</p>
                                <p className="alarm">🔗</p>
                                <p className="alarm">🔔</p>
                                <button className="active-button">Active</button>
                            </div>
                        </div>
                        <p className="poll-text">
                            Budget: {poll.budget}$
                        </p>
                        <p className="deadline">🛍️ 6 options  | ⏳ 2 days left</p>

                        {/* <div className="actions">
                             <button className="polls-buttons"onClick={() => handleDelete(poll.uuid)} >Delete</button>  
                            <button className="polls-buttons" onClick={() => navigate(`/update_poll/${poll.uuid}`)}>Update</button>
                            <button className="polls-buttons">Share</button>
                            <button className="polls-buttons" onClick={() => navigate(`/ideas`)}>Ideas</button>
                        </div> */}

                    </div>


                    {/* <div className="card create-card" onClick={() => navigate("/add-poll")}>
                        <div className="create-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="create-title">Create New Event</p>
                    </div> */}
                </div>
            </div>

            {/* <h1>{poll.title}</h1> */}
            <div className="poll-description">
                {/* <p>Budget: ${poll.budget}</p> */}
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
                    {/* <ul style={{ listStyle: "none", padding: 0 }}> */}
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
                                        {/* <a href={product.link}>Details</a>
                                        <a href="">Comments</a> */}
                                        {/* <a onClick={() => handleDeleteProduct(String(product.id))}>Delete</a> */}
                                        <button onClick={() => navigate(product.link)} className="details-button">Details</button>
                                        <button className="details-button">Comments (0)</button>
                                        <button onClick={() => handleDeleteProduct(String(product.id))} className="details-button">Delete</button>

                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                    {/* </ul> */}
                </div>
            </div>
        </>
    );
};


