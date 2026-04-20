import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import StarRating from "./Stars";
import { API_URL } from "../config";
import { useCarousel } from "../hooks/useCarousel";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react";

type Layout = "poll" | "gift";

interface ExtendedSearchProps extends SearchProps {
    layout?: Layout;
    getProducts?: () => Promise<void>;
}

const truncate = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

export default function SearchIdea({
    userSearch,
    layout = "poll",
    getProducts,
}: ExtendedSearchProps) {
    const { uuid } = useParams<{ uuid: string }>();

    const ideaTitle = userSearch ?? "";
    const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [addedProduct, setAddedProduct] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const {
        emblaApi,
        canScrollPrev,
        canScrollNext,
        emblaRef,
        slidesToShow,
        sentinelRef,
    } = useCarousel({
        showProducts,
        hasMore,
        loadingMore,
        loadMore: () => loadMore(),
        searchResults,
        layout
    })

    const handleSearch = async () => {
        const value = ideaTitle.trim();
        if (value.length < 2) {
            toast("Please enter at least 2 characters", {
                icon: "⚠️",
            });
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setPage(1);
        setHasMore(true);

        try {
            const response = await authFetch(
                `${API_URL}/products/search?${new URLSearchParams({
                    search: value,
                    page: "1",
                    size: "10",
                })}`,
            );
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.detail || "Failed to search");
                return;
            }

            setSearchResults(data.items);
            setShowProducts(true);
            setHasMore(data.page < data.pages);

        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
            console.error("Failed to search:", error);

        } finally {
            setLoading(false);
        }
    };

    // run search automatically
    useEffect(() => {
        if (ideaTitle && ideaTitle.trim().length >= 2) {
            handleSearch();
        }
    }, [ideaTitle]);

    const loadMore = async () => {
        if (!hasMore || loadingMore) return;

        const nextPage = page + 1;
        setLoadingMore(true);

        try {
            const response = await authFetch(
                `${API_URL}/products/search?${new URLSearchParams({
                    search: ideaTitle.trim(),
                    page: String(nextPage),
                    size: "10",
                })}`,
            );

            const data = await response.json();

            setSearchResults((prev) => [...prev, ...data.items]); // APPEND
            setPage(nextPage);

            setHasMore(data.page < data.pages);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleAddProduct = async (product: ProductSearch) => {
        try {
            const response = await authFetch(
                `${API_URL}/polls/${uuid}/products`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: product.title,
                        link: product.link,
                        image: product.image,
                        rating: product.rating,
                        price: product.price,
                    }),
                },
            );
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.detail || data.error || "Failed to add product");
                return;
            }

            toast.success("Product added successfully!", {
                duration: 2000,
            });
            console.log("Product added:", data);
            setAddedProduct((prev) => [...prev, product.link]);

            if (getProducts) await getProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to add product: ${error.message}`);
                console.error(`Failed to add product: ${error.message}`);
            } else {
                toast.error("Failed to add product!");
                console.error("Failed to add product!", error);
            }
        }
    };


    return (
        <>
            <div className="flex justify-between pt-3 pb-6">
                <h2 className="text-2xl flex items-center">{ideaTitle}</h2>
            </div>

            {/* No Results */}
            {showProducts &&
                hasSearched &&
                searchResults.length === 0 &&
                !loading && (
                    <p className="text-center mt-5 text-sm text-[#737791]">
                        No results found.
                    </p>
                )}

            {/* Products carousel */}
            {showProducts && searchResults.length > 0 && (
                <div className="relative w-full bg-[#6B5CFF33] rounded-[30px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
                    {/* Prev button */}
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollPrev}
                        aria-label="Previous"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                                flex items-center justify-center
                                w-9 h-9 rounded-full bg-[#6366f1] text-white
                                transition hover:bg-[#4F46E5]
                                disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowLeftIcon size={20} weight="bold" />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollNext}
                        aria-label="Next"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                                flex items-center justify-center
                                w-9 h-9 rounded-full bg-[#6366f1] text-white
                                transition hover:bg-[#4F46E5]
                                disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowRightIcon size={20} weight="bold" />
                    </button>

                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {searchResults.map((product) => (
                                <div
                                    key={product.link}
                                    className="flex-[0_0_calc(100%/var(--slides))] px-2"
                                    style={{ "--slides": slidesToShow } as React.CSSProperties}
                                >

                                    <div
                                        className="flex flex-col gap-4
                                        bg-white rounded-[30px] p-6
                                        shadow-md transition
                                        hover:-translate-y-1 hover:shadow-xl
                                        max-w-62.5 w-full"
                                    >
                                        {/* img */}
                                        <div
                                            className="h-32.5 flex items-center justify-center hover:text-[#0096FF] hover:cursor-pointer"
                                            onClick={() => window.open(product.link, "_blank")}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="max-h-full object-contain"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col gap-3 group relative">
                                            {/* Rating Price */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <StarRating rating={product.rating} color="#F25E0D" />
                                                    <span className="text-sm ml-0 text-[#737791] font-semibold">
                                                        {product.rating}
                                                    </span>
                                                </div>

                                                <span className="text-lg font-extrabold text-[#737791]">
                                                    ${product.price}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <div
                                                className="text-sm font-semibold leading-snug line-clamp-2 text-left hover:text-[#0096FF] hover:cursor-pointer"
                                                onClick={() => {
                                                    window.open(product.link, "_blank");
                                                }}
                                            >
                                                {truncate(product.title, 100)}
                                                {/* <Tooltip text={product.title} /> */}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-between gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddProduct(product)}
                                                    disabled={addedProduct.includes(product.link)}
                                                    className={`flex-3 h-10 rounded-full flex items-center justify-center text-white transition
                                                    ${addedProduct.includes(product.link)
                                                            ? "bg-[#B0B6CC] cursor-not-allowed"
                                                            : "bg-linear-to-br from-indigo-500 to-pink-300 hover:opacity-90 cursor-pointer "
                                                        }`}
                                                >
                                                    {addedProduct.includes(product.link) ? (
                                                        <CheckIcon size={20} weight="bold" />
                                                    ) : (
                                                        <PlusIcon size={20} weight="bold" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator slide */}
                            {hasMore && (
                                <div ref={sentinelRef} className="flex-[0_0_80px] flex items-center justify-center h-full px-2">
                                    <div className="text-[#737791] text-sm animate-pulse">
                                        {loadingMore ? "Loading..." : "Scroll for more"}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
