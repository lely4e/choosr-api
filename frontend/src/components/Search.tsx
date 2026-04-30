import { useState, useCallback } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StarRating from "./Stars";
import { API_URL } from "../config";
import { searchSchema, type SearchFormErrors } from "../schemas/searchSchema";
import { useCarousel } from "../hooks/useCarousel";
import { ArrowLeftIcon, ArrowRightIcon, CaretUpIcon, CheckIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";

export type Layout = "poll" | "gift";

interface ExtendedSearchProps extends SearchProps {
  layout?: Layout;
  getProducts?: () => Promise<void>;
  getPoll?: () => Promise<void>;
  openCard?: boolean;
  setOpenCard?: React.Dispatch<React.SetStateAction<boolean>>;
}

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
  getPoll,
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
  const [errors, setErrors] = useState<SearchFormErrors>({});

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
    if (showProducts) {
      setShowProducts(false);
      return;
    }

    const value = userInput.trim();
    const result = searchSchema.safeParse({ title: value });

    if (!result.success) {
      const fieldErrors: SearchFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SearchFormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
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
        })}`
      );

      const data = await response.json().catch(() => null);

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

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const response = await authFetch(
        `${API_URL}/products/search?${new URLSearchParams({
          search: userInput.trim(),
          page: String(nextPage),
          size: "10",
        })}`
      );
      const data = await response.json();

      setSearchResults((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(data.page < data.pages);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, page, userInput]);

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

      toast.success("Product added successfully!", { duration: 2000 });
      setAddedProduct((prev) => [...prev, product.link]);
      if (getProducts) await getProducts();
      await getPoll?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add product: ${message}`);
    }
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="grid place-items-center w-full mt-8">
        <div className="flex gap-2 w-full max-w-200 my-2">
          <input
            id="search"
            name="search"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search Amazon or add a custom product +"
            className={`flex-1 h-12 px-5 text-base font-serif italic
                        border-0 border-b bg-transparent
                        placeholder:text-[#737791] placeholder:italic
                        focus:border-blue-500 focus:outline-none
                        ${errors.title ? "border-red-400" : "border-[#737791]"}`}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center cursor-pointer
                       w-12 h-12 rounded-full bg-[#6366f1] text-white
                       transition hover:bg-[#4F46E5] disabled:opacity-50"
          >
            {loading ? (
              "..."
            ) : !showProducts ? (
              <MagnifyingGlassIcon size={20} weight="bold" data-testid="search-icon" />
            ) : (
              <CaretUpIcon size={20} weight="bold" />
            )}
          </button>

          <button
            onClick={() => setOpenCard && setOpenCard((prev) => !prev)}
            className="group relative flex items-center justify-center cursor-pointer
                       w-12 h-12 rounded-full transition hover:bg-[#B0B6CC]
                       bg-white/60 text-[#737791] hover:text-white
                       shadow-[0_10px_25px_rgba(0,0,0,0.06),0_4px_10px_rgba(0,0,0,0.04)]
                       duration-250 ease-in-out"
          >
            {!openCard ? (
              <>
                <PlusIcon size={20} weight="bold" />
                <Tooltip text="Add Product" />
              </>
            ) : (
              <CaretUpIcon size={20} weight="bold" />
            )}
          </button>
        </div>

        {errors.title && (
          <span className="text-red-500 text-xs">{errors.title}</span>
        )}
      </div>

      {/* No results */}
      {showProducts && hasSearched && searchResults.length === 0 && !loading && (
        <p className="text-center mt-5 text-sm text-[#737791]">
          No results found.
        </p>
      )}

      {/* Carousel */}
      {showProducts && searchResults.length > 0 && (
        <div className="w-full bg-[#0095FF33] rounded-[30px] p-10 relative mt-6">
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

          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {searchResults.map((product) => (
                <div
                  key={product.link}
                  className="flex-[0_0_calc(100%/var(--slides-to-show))] px-2"
                  style={
                    { "--slides-to-show": slidesToShow } as React.CSSProperties
                  }
                >
                  <div
                    className="flex flex-col gap-4
                                bg-white rounded-[30px] p-6
                                shadow-md transition
                                hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div
                      className="h-32.5 flex items-center justify-center
                                  hover:text-[#0096FF] hover:cursor-pointer"
                      onClick={() => window.open(product.link, "_blank")}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                      {/* Rating + Price */}
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
                        data-testid="productTitle"
                        className="text-sm font-semibold leading-snug line-clamp-2 text-left
                                    hover:text-[#0096FF] hover:cursor-pointer "
                        onClick={() => window.open(product.link, "_blank")}
                      >
                        {truncate(product.title, 100)}
                      </div>

                      {/* Add button */}
                      <div className="flex justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          disabled={addedProduct.includes(product.link)}
                          className={`flex-3 h-10 rounded-full flex items-center justify-center
                                      text-white transition
                                      ${addedProduct.includes(product.link)
                              ? "bg-[#B0B6CC] cursor-not-allowed"
                              : "bg-linear-to-br from-[#6366F1] to-[#A78BFA] hover:opacity-90 cursor-pointer"
                            }`}
                        >
                          {addedProduct.includes(product.link) ? (
                            <CheckIcon size={20} weight="bold" />
                          ) : (
                            <PlusIcon size={20} weight="bold" data-testid="plus-icon" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Sentinel slide — observed to trigger loadMore */}
              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex-[0_0_80px] flex items-center justify-center px-2"
                >
                  <span className="text-[#737791] text-sm animate-pulse">
                    {loadingMore ? "Loading…" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}