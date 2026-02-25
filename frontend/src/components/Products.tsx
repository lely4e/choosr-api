import { useState } from "react";
import type { ProductsProps, Product, Comment } from "../utils/types";
import { authFetch } from "../utils/auth";
import {
    FileText,
    ThumbsUp,
    CheckCircle,
    MessageCircle,
    Trash2,
    Dot,
    X,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import confetti from "canvas-confetti";
import StarRating from "./Stars";

const Tooltip = ({ text }: { text: string }) => (
    <span
        className="absolute bottom-[80%] left-1/2 -translate-x-1/2 bg-[#737791]
     text-white px-2.5 py-1.5 rounded text-xs opacity-0 invisible group-hover:opacity-100 
     group-hover:visible transition-opacity duration-200 pointer-events-none z-10 max-w-75
     text-center whitespace-normal"
    >
        {text}
    </span>
);

export default function Products({
    uuid,
    products,
    setProducts,
    getProducts,
}: ProductsProps) {
    const { user } = useUser();

    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [openCommentsProductId, setOpenCommentsProductId] = useState<
        number | null
    >(null);
    const [textComment, setTextComment] = useState<Record<number, string>>({});

    const [open, setOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);

    const truncate = (text: string, maxLength = 65) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const handleDeleteProduct = async (productId: number) => {
        // if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}`,
                {
                    method: "DELETE",
                },
            );
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.detail || data.error || "Failed to delete product.");
                console.error("Failed to delete product:", data);
                return;
            }
            setProducts((prev) =>
                prev.filter((product: Product) => product.id !== Number(productId)),
            );
            toast.success("Product deleted successfully!", {
                duration: 2000,
            });
            setOpen(false);

            console.log("Product deleted:", data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to delete product: ${error.message}`);
                console.error(`Failed to delete product: ${error.message}`);
            } else {
                toast.error("Failed to delete product!");
                console.error("Failed to delete product!", error);
            }
        }
    };

    const showComments = async (productId: number) => {
        if (openCommentsProductId === productId) {
            setOpenCommentsProductId(null);
            return;
        }
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}/comments`,
            );
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                toast.error(data.detail || data.error || "Failed to load comments.");
                return;
            }

            const data = await response.json();
            setComments((prev: Record<number, Comment[]>) => ({
                ...prev,
                [productId]: data,
            }));
            setOpenCommentsProductId(productId);
            console.log("Amount of comments:", data.length);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to load comments: ${error.message}`);
                console.error(`Failed to load comments: ${error.message}`);
            } else {
                toast.error("Failed to load comments!");
                console.error("Failed to load comments!", error);
            }
        }
    };

    const handleVote = async (
        productId: number,
        hasVoted: boolean,
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        if (!uuid) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        try {
            if (hasVoted) {
                await authFetch(
                    `http://127.0.0.1:8000/${uuid}/products/${productId}/vote`,
                    { method: "DELETE" },
                );
                toast.success("You unvoted!", {
                    duration: 2000,
                });
                console.log("hasVoted ->", hasVoted, "deleting vote");
            } else {
                await authFetch(
                    `http://127.0.0.1:8000/${uuid}/products/${productId}/vote`,
                    { method: "POST" },
                );
                confetti({
                    particleCount: 100,
                    spread: 90,
                    startVelocity: 40,
                    origin: { x, y },
                    colors: ["#F25E0D", "#0096FF", "#737791"],
                });
                toast.success("You voted!", {
                    duration: 2000,
                });
                console.log("hasVoted ->", hasVoted, "adding vote");
            }
            await getProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Vote failed: ${error.message}`);
                console.error(`Vote failed: ${error.message}`);
            } else {
                toast.error("Vote failed!");
                console.error("Vote failed!", error);
            }
        }
    };

    const handleAddComment = async (productId: number) => {
        if (!uuid) return;
        const text = textComment[productId]?.trim();
        if (!text) {
            toast.error("Comment cannot be empty.");
            return;
        }
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}/comments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: textComment[productId] }),
                },
            );
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.detail || data.error || "Adding comment failed");
                console.error("Error to add comment:", data);
                return;
            }
            toast.success("Comment added successfully!", {
                duration: 2000,
            });
            console.log("Comment added successfully:", data);
            await getProducts();
            setComments((prev) => ({
                ...prev,
                [productId]: [...(prev[productId] || []), data],
            }));
            setTextComment((prev) => ({ ...prev, [productId]: "" }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to add comment: ${error.message}`);
                console.error(`Failed to add comment: ${error.message}`);
            } else {
                toast.error("Failed to add comment!");
                console.error("Failed to add comment!", error);
            }
        }
    };

    const handleDeleteComment = async (productId: number, commentId: number) => {
        if (!uuid) return;
        // if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products/${productId}/comments/${commentId}`,
                { method: "DELETE" },
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.detail || data.error || "Failed to delete comment");
                console.error("Failed to delete comment:", data);
                return;
            }

            toast.success("Comment deleted successfully!", {
                duration: 2000,
            });
            setOpenComment(false);
            console.log("Comment deleted successfully:", data);

            await getProducts();
            setComments((prev: Record<number, Comment[]>) => ({
                ...prev,
                [productId]: (prev[productId] || []).filter(
                    (comment) => comment.id !== commentId,
                ),
            }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to delete comment: ${error.message}`);
                console.error(`Failed to delete comment: ${error.message}`);
            } else {
                toast.error("Failed to delete comment!");
                console.error("Failed to delete comment!", error);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const totalVotes = products.reduce((sum, p) => sum + p.votes, 0);
    const votePercent = (votes: number) =>
        totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    console.log("max", totalVotes);

    return (
        <>
            {/* wrap-product */}
            <div className="mx-auto flex justify-center">
                {/* product-container */}
                <div className="grid gap-6 w-full max-w-200 my-10 mx-auto grid-cols-1">
                    {products.map((product) => (
                        <div key={product.id} className="mb-4">
                            {/* card-product */}
                            <div
                                className="relative 
  bg-white/[0.841]
max-w-200 backdrop-blur-[10px] rounded-[30px] p-6 
flex shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
transition-all duration-250 ease-in-out gap-3 
hover:-translate-y-1 
hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.06)]"
                            >
                                {/* product-image-container */}
                                <div className="w-50 max-h-57.5 aspect-square rounded-xl overflow-hidden shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover block"
                                    />
                                </div>

                                {/* product-text */}
                                <div className="flex flex-col pl-5 text-left flex-1">
                                    {/* product-title-price */}
                                    <div className="flex justify-between items-start gap-5">
                                        <div className="flex text-sm text-[#555] gap-2.5 items-center">
                                            <div className="flex items-center text-[#737791]">
                                                <StarRating rating={product.rating} />
                                            </div>
                                            <div className="text-[#737791]">
                                                <strong>{product.rating}</strong>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-extrabold text-[#737791] mb-2">
                                            ${product.price}
                                        </div>
                                    </div>

                                    {/* product-title: "group" activates the Tooltip on hover */}
                                    <div className="group relative font-semibold text-[0.9rem] leading-[1.4]">
                                        {truncate(product.title)}
                                        <Tooltip text={product.title} />
                                    </div>

                                    {/* action buttons row */}
                                    <div className="flex justify-start items-center gap-5 py-2.5">
                                        <div className="flex gap-2.5 mt-1 justify-between">
                                            {/* "group" on each button activates its own Tooltip independently */}
                                            <button
                                                onClick={() => window.open(product.link, "_blank")}
                                                className="group relative flex-1 px-3 py-1.5 border border-[#737791] 
                                                cursor-pointer whitespace-nowrap text-[#737791] bg-transparent text-[0.85rem] 
                                                rounded-[20px] flex gap-1.5 justify-center items-center hover:text-[#F25E0D] hover:border-[#F25E0D]"
                                            >
                                                <FileText size={14} strokeWidth={2} />
                                                <Tooltip text="Details" />
                                            </button>

                                            <button
                                                className="group relative flex-1 px-3 py-1.5 border border-[#737791] 
                                                cursor-pointer whitespace-nowrap text-[#737791] bg-transparent text-[0.85rem] 
                                                rounded-[20px] flex gap-1.5 justify-center items-center hover:text-[#F25E0D] hover:border-[#F25E0D]"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    showComments(product.id);
                                                }}
                                            >
                                                <MessageCircle size={14} strokeWidth={2} />{" "}
                                                {product.comments}
                                                <Tooltip text="Comments" />
                                            </button>

                                            {user && user.id === product.user_id && (
                                                <button
                                                    onClick={() => setOpen(true)}
                                                    className="group relative flex-1 px-3 py-1.5 border border-[#737791] 
                                                cursor-pointer whitespace-nowrap text-[#737791] bg-transparent text-[0.85rem] 
                                                rounded-[20px] flex gap-1.5 justify-center items-center hover:text-[#F25E0D] hover:border-[#F25E0D]"
                                                >
                                                    <Trash2 size={14} strokeWidth={2} />
                                                    <Tooltip text="Delete Product" />
                                                </button>
                                            )}
                                            <div>
                                                {open &&
                                                    ReactDOM.createPortal(
                                                        <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-9999">
                                                            <div className="bg-white p-10 rounded-2xl z-50">
                                                                <h3 className="font-bold text-lg ">
                                                                    Are you sure you want to delete this product?
                                                                </h3>

                                                                <div className="flex mt-10 flex-1 gap-2 justify-between">
                                                                    <button
                                                                        className="flex-1 border  rounded-xl px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                                                        onClick={() => setOpen(false)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="flex-1  bg-red-600 text-white rounded-xl px-6 py-2  hover:bg-red-700 hover:text-white transition-colors"
                                                                        onClick={() =>
                                                                            handleDeleteProduct(product.id)
                                                                        }
                                                                    >
                                                                        Yes, Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>,
                                                        document.body,
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* votes + percentage */}
                                    <div className="flex text-sm text-[#555] gap-2.5 justify-between">
                                        <div className="flex text-sm gap-2.5 items-center">
                                            <ThumbsUp
                                                size={14}
                                                strokeWidth={2}
                                                className="text-[#F25E0D]"
                                            />
                                            <div className="text-[#F25E0D]">
                                                {product.votes === 1 ? (
                                                    <strong>{product.votes} vote</strong>
                                                ) : (
                                                    <strong>{product.votes} votes</strong>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex text-sm gap-2.5 items-center">
                                            <div className="text-[#F25E0D] text-xl">
                                                <strong>
                                                    {Math.floor(votePercent(product.votes))}%
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* progress bar */}
                                    <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-2.5">
                                        <div
                                            className="h-full bg-linear-to-br from-[#ff6a00] to-[#ec4899] transition-[width] duration-300"
                                            style={{
                                                width: `${(product.votes / totalVotes) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    {/* vote button: "group" activates Tooltip on hover */}
                                    <div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleVote(product.id, product.has_voted, e);
                                            }}
                                            className={`group relative flex w-full rounded-xl items-center justify-center 
                                                gap-2.5 py-4 transition-colors duration-200 text-white "
                                            ${!product.has_voted
                                                    ? "bg-[#F25E0D] cursor-pointer"
                                                    : "bg-[#B0B6CC] "
                                                }`}
                                        >
                                            {!product.has_voted ? (
                                                <ThumbsUp size={24} strokeWidth={2} />
                                            ) : (
                                                <CheckCircle size={24} strokeWidth={2} />
                                            )}
                                            <Tooltip
                                                text={
                                                    !product.has_voted
                                                        ? "Vote for this Product!"
                                                        : "Voted"
                                                }
                                            />
                                        </button>
                                    </div>

                                    {/* Comments section */}
                                    {openCommentsProductId === product.id && (
                                        <>
                                            <div className="flex justify-between items-center mt-6 mb-1">
                                                <h3 className="font-medium text-xl">Comments</h3>
                                                <X
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        showComments(product.id);
                                                    }}
                                                    className="cursor-pointer"
                                                ></X>
                                            </div>
                                            {comments[product.id]?.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="flex gap-2.5 justify-between items-center "
                                                >
                                                    <p className="text-[#737791] text-sm p-4  bg-[#E6E9F2]  mt-3 rounded-3xl rounded-bl-none flex-1 flex items-center pl-4">
                                                        <img
                                                            src="../src/assets/profile.svg"
                                                            alt="profile-foto"
                                                            className="w-8 mr-3"
                                                        />
                                                        <div className="">
                                                            <p className="mr-2 text-xs flex items-center">
                                                                {comment.created_by} <Dot></Dot>{" "}
                                                                {formatDate(String(comment.created_at))}
                                                            </p>

                                                            <p className="font-bold"> {comment.text} </p>
                                                        </div>
                                                    </p>

                                                    {user && user.id === comment.user_id && (
                                                        <Trash2
                                                            size={14}
                                                            strokeWidth={1.5}
                                                            onClick={() => setOpenComment(true)}
                                                            className="cursor-pointer text-[#737791] hover:text-[#F25E0D] items-center"
                                                        />
                                                    )}
                                                    <div>
                                                        {openComment &&
                                                            ReactDOM.createPortal(
                                                                <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-9999">
                                                                    <div className="bg-white p-10 rounded-2xl z-50">
                                                                        <h3 className="font-bold text-lg ">
                                                                            Are you sure you want to delete this
                                                                            comment?
                                                                        </h3>

                                                                        <div className="flex mt-10 flex-1 gap-2 justify-between">
                                                                            <button
                                                                                className="flex-1 border  rounded-xl px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                                                                onClick={() => setOpenComment(false)}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                className="flex-1  bg-red-600 text-white rounded-xl px-6 py-2  hover:bg-red-700 hover:text-white transition-colors"
                                                                                onClick={() =>
                                                                                    handleDeleteComment(
                                                                                        product.id,
                                                                                        comment.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Yes, Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>,
                                                                document.body,
                                                            )}
                                                    </div>
                                                </div>
                                            ))}

                                            <form
                                                className="flex flex-col gap-2.5 mt-4"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddComment(product.id);
                                                }}
                                            >
                                                <textarea
                                                    value={textComment[product.id] || ""}
                                                    onChange={(e) =>
                                                        setTextComment((prev) => ({
                                                            ...prev,
                                                            [product.id]: e.target.value,
                                                        }))
                                                    }
                                                    className="p-2 rounded-xl border border-[#ddd] outline-none bg-white mt-1.5
                                                    text-[#737791] focus:border-[#F25E0D] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] 
                                                    font-[inherit] transition-all duration-200"
                                                />
                                                <button
                                                    type="submit"
                                                    className="self-end px-4 py-2 rounded-full border-none bg-[#F25E0D]
                                                     text-white cursor-pointer hover:bg-black transition-colors duration-200"
                                                >
                                                    Add Comment
                                                </button>
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
}
