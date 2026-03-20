import { useState } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";
import {
  LucideArrowLeft,
  LucideArrowRight,
  SearchIcon,
  ChevronUp,
  Plus,
  Check,
} from "lucide-react";
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
  openCard?: boolean;
  setOpenCard?: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function Search({
  userSearch,
  layout = "poll",
  getProducts,
  openCard,
  setOpenCard,
}: ExtendedSearchProps) {
  const { uuid } = useParams<{ uuid: string }>();

  const [userInput, setUserInput] = useState(userSearch ?? "");
  const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSearch = async () => {
    if (showProducts) {
      setShowProducts(false);
      return;
    }

    const value = userInput.trim();
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

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const response = await authFetch(
        `${API_URL}/products/search?${new URLSearchParams({
          search: userInput.trim(),
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
      const response = await authFetch(`${API_URL}/polls/${uuid}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          link: product.link,
          image: product.image,
          rating: product.rating,
          price: product.price,
        }),
      });
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

  const handleAfterChange = (currentIndex: number) => {
    const totalSlides = searchResults.length;
    const visibleSlides = 4;

    if (currentIndex >= totalSlides - visibleSlides - 1) {
      loadMore();
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
    <div className="w-full">
      <div className="grid place-items-center w-full mt-8">
        <div className="flex gap-2 w-full max-w-200 my-5">
          <input
            id="search"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Search Amazon or add a custom product +"
            className="flex-1 h-12 px-5 text-base font-serif italic
                     border-0 border-[#6366f1] border-b
                     bg-transparent
                     placeholder:text-[#737791]
                     placeholder:italic
                     focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center cursor-pointer 
                     w-12 h-12 rounded-full
                     bg-[#6366f1] text-white
                     transition hover:bg-[#4F46E5]
                     disabled:opacity-50"
          >
            {loading ? (
              "..."
            ) : !showProducts ? (
              <SearchIcon size={20} strokeWidth={2} />
            ) : (
              <ChevronUp size={20} strokeWidth={2} />
            )}
          </button>
          <button
            onClick={() => setOpenCard && setOpenCard((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer 
                    w-12 h-12 rounded-full
                    transition hover:bg-[#B0B6CC]
                    disabled:opacity-50
                    bg-white/60 text-[#737791]
                    hover:text-white
                    shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)] 
                    duration-250 ease-in-out"
          >
            {!openCard ? (
              <Plus size={26} strokeWidth={2} />
            ) : (
              <ChevronUp size={20} strokeWidth={2} />
            )}
          </button>
        </div>
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
        <div className="w-full bg-[#0095FF33] rounded-[30px] p-10">
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
                      <div className="flex items-center ">
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
                            : "bg-linear-to-br from-[#6366F1] to-[#A78BFA] hover:opacity-90 cursor-pointer "
                          }`}
                      >
                        {addedProduct.includes(product.link) ? (
                          <Check size={20} />
                        ) : (
                          <Plus size={20} />
                        )}
                      </button>
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
