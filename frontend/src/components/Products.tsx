import { useState } from "react";
import type { ProductsProps, Product, Comment } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import confetti from "canvas-confetti";
import StarRating from "./Stars";
import { API_URL } from "../config";
import { ChatCircleTextIcon, CheckIcon, DotIcon, ThumbsUpIcon, TrashSimpleIcon, XIcon } from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";


export default function Products({
    uuid,
    products,
    setProducts,
    getProducts,
    sentinelRef,
    loadingMore,
    hasMore,
}: ProductsProps) {
    const { user } = useUser();

    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [openCommentsProductId, setOpenCommentsProductId] = useState<number | null>(null);
    const [textComment, setTextComment] = useState<Record<number, string>>({});

    const [open, setOpen] = useState(0);
    const [openComment, setOpenComment] = useState(false);

    const truncate = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const handleDeleteProduct = async (productId: number) => {
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products/${productId}`,
                {
                    method: "DELETE",
                },
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                toast.error(data?.detail || "Failed to delete product");
                console.error("Failed to delete product:", data);
                return;
            }
            setProducts((prev) =>
                prev.filter((product: Product) => product.id !== Number(productId)),
            );
            toast.success("Product deleted successfully!", {
                duration: 2000,
            });
            setOpen(0);

            console.log("Product deleted:", data);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to delete product:", error);
        }
    };

    const showComments = async (productId: number) => {
        if (openCommentsProductId === productId) {
            setOpenCommentsProductId(null);
            return;
        }
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products/${productId}/comments`,
            );
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                toast.error(data?.detail || "Failed to load comments");
                return;
            }

            const data = await response.json();
            setComments((prev: Record<number, Comment[]>) => ({
                ...prev,
                [productId]: data,
            }));
            setOpenCommentsProductId(productId);
            console.log("Amount of comments:", data.length);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to load comments:", error);
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
                    `${API_URL}/polls/${uuid}/products/${productId}/vote`,
                    { method: "DELETE" },
                );
                toast.success("You unvoted!", {
                    duration: 2000,
                });
                console.log("hasVoted ->", hasVoted, "deleting vote");
            } else {
                await authFetch(
                    `${API_URL}/polls/${uuid}/products/${productId}/vote`,
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
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to vote:", error);
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
                `${API_URL}/polls/${uuid}/products/${productId}/comments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: textComment[productId] }),
                },
            );
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                toast.error(data?.detail || "Adding comment failed");
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
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to add comment:", error);
        }
    };

    const handleDeleteComment = async (productId: number, commentId: number) => {
        if (!uuid) return;

        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products/${productId}/comments/${commentId}`,
                { method: "DELETE" },
            );

            const data = await response.json().catch(() => null);

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
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to delete comment:", error);
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
                                <div
                                    className="w-50 max-h-57.5 aspect-square rounded-xl overflow-hidden shrink-0 hover:text-[#0096FF] hover:cursor-pointer"
                                    onClick={() => window.open(product.link, "_blank")}
                                >
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
                                    <div
                                        className="group relative font-semibold text-[0.9rem] leading-[1.4] hover:text-[#0096FF] hover:cursor-pointer"
                                        onClick={(e) => {
                                            window.open(product.link, "_blank");
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        {truncate(product.title)}
                                        <Tooltip text={product.title} />
                                    </div>

                                    {/* action buttons row */}
                                    <div className="flex justify-between items-end gap-5 py-2.5">
                                        <div className="flex">

                                            {user && user.id === product.user_id && (
                                                <button
                                                    onClick={() => setOpen(product.id)}
                                                    className="group relative 
                                                
                                                cursor-pointer whitespace-nowrap text-[#737791] bg-transparent text-[0.85rem] 
                                                rounded-[20px] flex gap-1.5 justify-center items-center hover:text-[#F25E0D] "
                                                >
                                                    <TrashSimpleIcon size={17} strokeWidth={2} />
                                                    <Tooltip text="Delete Product" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex text-sm gap-1 items-center">
                                            <div className="flex text-sm gap-3 items-center">
                                                <button
                                                    className={`group relative 
                                                    flex gap-1 justify-center items-center whitespace-nowrap text-[0.85rem] cursor-pointer
                                                ${openCommentsProductId === product.id
                                                            ? "text-[#F25E0D] " 
                                                            : "bg-transparent text-[#737791]  hover:text-[#F25E0D] "
                                                        }`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        showComments(product.id);
                                                    }}
                                                >
                                                    {product.comments > 0 ?
                                                    <>
                                                    <ChatCircleTextIcon size={17} strokeWidth={2} weight="fill" />
                                                    {product.comments}
                                                    <Tooltip text="Comments" />
                                                    </>
                                                    :
                                                    <>
                                                    <ChatCircleTextIcon size={17} strokeWidth={2}  />
                                                    {product.comments}
                                                    <Tooltip text="Comments" />
                                                    </>}
                                                </button>

                                                <div className="flex items-center gap-1 justify-center ">
                                                  
                                                    {product.has_voted ?
                                                    <>
                                                      <ThumbsUpIcon
                                                        size={17}
                                                        weight="fill"
                                                        strokeWidth={2}
                                                        className="text-[#F25E0D]"
                                                    />
                                                    <div className="text-[#F25E0D] ">
                                                        {product.votes}
                                                    </div>
                                                    </>
                                                    : 
                                                    <>
                                                    <ThumbsUpIcon
                                                        size={17}
                                                        // weight="fill"
                                                        strokeWidth={2}
                                                        className="text-[#737791]"
                                                    />
                                                     <div className="text-[#737791] ">
                                                        {product.votes}
                                                    </div>
                                                    </>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                {open === product.id &&
                                                    ReactDOM.createPortal(
                                                        <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-9999">
                                                            <div className="bg-white p-10 rounded-2xl z-50">
                                                                <h3 className="font-bold text-lg ">
                                                                    Are you sure you want to delete this product?
                                                                </h3>

                                                                <div className="flex mt-10 flex-1 gap-2 justify-between">
                                                                    <button
                                                                        className="flex-1 border  rounded-full px-6 py-2 hover:bg-[#B0B6CC] hover:text-white transition-colors"
                                                                        onClick={() => setOpen(0)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="flex-1  bg-red-600 text-white rounded-full px-6 py-2  hover:bg-red-700 hover:text-white transition-colors"
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

                                    {/* progress bar */}
                                    <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden my-1.5 mb-2.5">
                                        <div
                                            className={`h-full 
                                                    ${totalVotes === 0
                                                    ? "bg-[#e5e7eb]"
                                                    : "bg-linear-to-br from-[#ff6a00] to-[#ec4899] transition-[width] duration-300"
                                                }`}
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
                                            className={`group relative flex w-full rounded-full items-center justify-center 
                                                gap-2.5 py-4 transition-colors duration-200 text-white 
                                            ${!product.has_voted
                                                    ? "bg-linear-to-r from-[#FF8A5B] to-[#FF6A00] cursor-pointer"
                                                    : "bg-[#B0B6CC] "
                                                }`}
                                        >
                                            {!product.has_voted ? (
                                                <ThumbsUpIcon size={26} strokeWidth={2} />
                                            ) : (
                                                <CheckIcon size={24} strokeWidth={2} />
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
                                                <XIcon
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        showComments(product.id);
                                                    }}
                                                    className="cursor-pointer"
                                                    size={20}
                                                ></XIcon>
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
                                                                {comment.created_by} <DotIcon size={20} weight="bold"></DotIcon>{" "}
                                                                {formatDate(String(comment.created_at))}
                                                            </p>

                                                            <p className="font-bold"> {comment.text} </p>
                                                        </div>
                                                    </p>

                                                    {user && user.id === comment.user_id && (
                                                        <TrashSimpleIcon
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
                    <div ref={sentinelRef} className="h-4 w-full" />

                    {loadingMore && (
                        <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-[#6366f1] 
                            border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {!hasMore && products.length > 0 && (
                        <p className="text-center text-sm text-[#737791] py-4">
                            No more products
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
