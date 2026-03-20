import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";
import { LucideArrowLeft, LucideArrowRight, Plus, Check } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import StarRating from "./Stars";
import { API_URL } from "../config";

type Layout = "poll" | "gift";

interface ExtendedSearchProps extends SearchProps {
    layout?: Layout;
    getProducts?: () => Promise<void>;
}

const CustomPrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#6366f1",
                borderRadius: "50%",
                width: 36,
                height: 36,
                zIndex: 2,
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <LucideArrowLeft color="white" size={20} />
        </div>
    );
};

const CustomNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#6366f1",
                borderRadius: "50%",
                width: 36,
                height: 36,
                zIndex: 2,
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <LucideArrowRight color="white" size={20} />
        </div>
    );
};

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
                toast.error(data.detail || data.error || "Failed to search");
                return;
            }

            setSearchResults(data.items);
            setShowProducts(true);

            setHasMore(data.page < data.pages);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(`Failed to search: ${error.message}`);
                console.error(`Failed to search: ${error.message}`);
            } else {
                toast.error("Failed to search!");
                console.error("Failed to search!", error);
            }
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

    const handleAfterChange = (currentIndex: number) => {
        const totalSlides = searchResults.length;
        const visibleSlides = 4;

        if (currentIndex >= totalSlides - visibleSlides - 1) {
            loadMore();
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

    // Slick Settings
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: layout === "poll" ? 4 : 2,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        swipe: true,
        draggable: true,
        swipeToSlide: true,
        touchMove: true,
        touchThreshold: 10,
        adaptiveHeight: true,
        afterChange: handleAfterChange,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: layout === "poll" ? 3 : 1 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: layout === "poll" ? 2 : 1 },
            },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="">
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
                <div className="w-full bg-[#6B5CFF33] rounded-[30px] p-10">
                    <Slider {...settings}>
                        {searchResults.map((product) => (
                            <div key={product.link} className="flex justify-center px-2">
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
                                                className={`flex-3 h-10 rounded-full flex items-center justify-center text-white 
                               transition
                               ${addedProduct.includes(product.link)
                                                        ? "bg-[#B0B6CC] cursor-not-allowed"
                                                        : "bg-linear-to-br from-indigo-500 to-pink-300 hover:opacity-90 cursor-pointer "
                                                    }`}
                                            >
                                                {addedProduct.includes(product.link) ? (
                                                    <Check size={20} />
                                                ) : (
                                                    <Plus size={20} />
                                                )}
                                            </button>

                                            {/* <button
                                                className="flex-1 rounded-full border border-[#0d78f2] cursor-pointer
                                 text-[#0d78f2] py-2 text-sm
                                 flex items-center justify-center
                                 hover:bg-[#0d78f210] transition"
                                            >
                                                <Bookmark size={16} />
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator slide */}
                        {hasMore && (
                            <div className="flex items-center justify-center h-full px-2">
                                <div className="text-[#737791] text-sm animate-pulse">
                                    {loadingMore ? "Loading..." : "Scroll for more"}
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
            )}
        </div>
    );
}
