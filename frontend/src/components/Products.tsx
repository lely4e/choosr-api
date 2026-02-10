import { useState } from "react";
import type { ProductsProps, Product, Comment } from "../utils/types";
import { authFetch } from "../utils/auth";
import { FileText, ThumbsUp, CheckCircle, Star, StarIcon, MessageCircle, Trash2 } from "lucide-react"


export default function Products({ uuid, products, setProducts, getProducts }: ProductsProps) {

    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [openCommentsProductId, setOpenCommentsProductId] = useState<number | null>(null);

    const [textComment, setTextComment] = useState<Record<number, string>>({});

    const truncate = (text: string, maxLength = 65) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };


    // delete product
    const handleDeleteProduct = async (product_id: string) => {
        if (!window.confirm("Are you sure you want to delete this poll?")) return;

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

                    {products.map(product => (
                        <div key={product.id} style={{ marginBottom: "16px" }}>
                            <div className="card-product">

                                <div className="product-image-container">
                                    <img src={product.image} alt={product.title} className="product-image" />
                                </div>

                                <div className="product-text">
                                    <div className="product-title-price">
                                        {/* <div className="product-title">{truncate(product.title, 60)}</div> */}
                                        <div className="product-rating">
                                            <div style={{ color: '#737791', display: "flex", alignItems: "center" }}>
                                                <StarIcon size={12} fill="#737791" strokeWidth={1.5} />
                                                <StarIcon size={12} fill="#737791" strokeWidth={1.5} />
                                                <StarIcon size={12} fill="#737791" strokeWidth={1.5} />
                                                <StarIcon size={12} fill="#737791" strokeWidth={1.5} />
                                                <Star size={12} strokeWidth={1.5} />
                                            </div>

                                            <div>
                                                <div style={{ color: '#737791' }}><strong>{product.rating}</strong>
                                                    {/* (2,345 reviews) */}
                                                </div></div></div>
                                        <div className="product-price">${product.price}</div>
                                    </div>
                                    <div className="product-title">{truncate(product.title)} <span className="tooltip">{product.title}</span></div>
                                    <div className="rating">

                                        <div className="products-link-comments">

                                            <button onClick={() => window.open(product.link, "_blank")}
                                                className="details-button"
                                                style={{
                                                    display: "flex",
                                                    gap: 5,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    color: "#737791",

                                                }}>
                                                <FileText size={14} strokeWidth={1.5} />
                                                <span className="tooltip">Details</span>
                                            </button>

                                            <button className="details-button"
                                                style={{
                                                    display: "flex",
                                                    gap: 5,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    showComments(product.id)

                                                }}
                                            >
                                                <MessageCircle size={14} strokeWidth={1.5} /> ({product.comments})
                                                <span className="tooltip">Comments</span>
                                            </button>
                                            <button
                                                style={{
                                                    display: "flex",
                                                    gap: 5,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                                onClick={() => handleDeleteProduct(String(product.id))}
                                                className="details-button">
                                                <Trash2 size={14} strokeWidth={1.5} />
                                                <span className="tooltip">Delete Product</span>
                                            </button>
                                        </div>
                                    </div>








                                    {/* <div className="products-link-comments">

                                        <button onClick={() => window.open(product.link, "_blank")} className="details-button"
                                            style={{
                                                display: "flex",
                                                gap: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "#737791",

                                            }}>
                                            <FileText size={14} strokeWidth={1.5} />
                                        </button>

                                        <button className="details-button"
                                            style={{
                                                display: "flex",
                                                gap: 5,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                showComments(product.id)

                                            }}
                                        >
                                            <MessageCircle size={14} strokeWidth={1.5} /> ({product.comments})</button>

                                        <button
                                            style={{
                                                display: "flex",
                                                gap: 5,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                            onClick={() => handleDeleteProduct(String(product.id))} className="details-button">
                                            <Trash2 size={14} strokeWidth={1.5} /> </button>

                                    </div> */}



                                    <div className="product-votes-percent ">

                                        <div className="product-rating">
                                            <div style={{ display: "flex", alignItems: "center" }}><ThumbsUp size={14} strokeWidth={2} style={{ color: '#F25E0D' }} /></div>
                                            <div style={{ color: '#F25E0D' }}><strong>{product.votes} votes</strong> </div>
                                        </div>


                                        <div className="product-rating">


                                            <div>
                                                <div style={{ color: '#F25E0D', fontSize: 20 }}><strong>43%</strong>
                                                    {/* (2,345 reviews) */}
                                                </div> </div> </div>

                                    </div>

                                    <div className="progress">
                                        <div className="progress-bar" style={{ width: "40%" }}></div>
                                    </div>

                                    <div>

                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleVote(product.id, product.has_voted)
                                        }} className="vote"
                                            style={{
                                                background: !product.has_voted ? "#F25E0D" : "#B0B6CC",
                                                display: "flex",
                                                gap: 10
                                            }}
                                        >
                                            {!product.has_voted ? (
                                                <ThumbsUp size={24} strokeWidth={2} />

                                            ) : (
                                                <CheckCircle size={24} strokeWidth={2} />)}

                                            {/* {!product.has_voted ? "Vote!" : "Voted!"} */}

                                            <span className="tooltip">{!product.has_voted ? "Vote for this Product!" : "Voted"}</span>
                                        </button>
                                    </div>

                                    {openCommentsProductId === product.id && (
                                        <>
                                            {comments[product.id]?.map(comment => (
                                                <div key={comment.id} className="comment" style={{
                                                    display: "flex",
                                                    gap: 5,
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <p style={{ color: "#737791" }}>
                                                        {comment.created_by}: "{comment.text}"
                                                    </p>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: 5,
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        <Trash2 size={14} strokeWidth={1.5} onClick={() => handleDeleteProduct(String(product.id))} /> </div>
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


