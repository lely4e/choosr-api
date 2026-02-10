import { useState } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";
import { StarIcon, FileText, Bookmark, LucideArrowLeft, LucideArrowRight, SearchIcon, ChevronUp, Plus, Check } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


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
        background: "#0096FF",
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
        background: "#0096FF",
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

export default function Search({ userSearch, layout = "poll", getProducts }: ExtendedSearchProps) {
  const { uuid } = useParams<{ uuid: string }>();

  const [userInput, setUserInput] = useState(userSearch ?? "");
  const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string[]>([]);

  const handleSearch = async () => {
    if (showProducts) {
      setShowProducts(false);
      return;
    }

    const value = userInput.trim();
    if (value.length < 2) {
      alert("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await authFetch(
        `http://127.0.0.1:8000/products/search?search=${encodeURIComponent(value)}`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.error || "Request failed");
        return;
      }

      setSearchResults(data);
      setShowProducts(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product: ProductSearch) => {
    try {
      const response = await authFetch(`http://127.0.0.1:8000/${uuid}/products`, {
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
        alert(data.detail || data.error || "Request failed");
        return;
      }

      console.log("Product added:", data);
      setAddedProduct(prev => [...prev, product.link]);

      if (getProducts) await getProducts();

    } catch (error) {
      console.error(error);
    }
  };

  // --- SLICK SETTINGS ---
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
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: layout === "poll" ? 3 : 1 } },
      { breakpoint: 768, settings: { slidesToShow: layout === "poll" ? 2 : 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={`search-root ${layout === "gift" ? "search-gift" : "search-poll"}`}>
      {/* --- SEARCH BAR --- */}
      <div className="search-bar">
        <div className="search-container">
          <input
            id="search"
            className="search-product"
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Wireless Headphones"
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading
              ? "Loading..."
              : !showProducts
                ? <SearchIcon size={24} strokeWidth={2} />
                : <ChevronUp size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* --- NO RESULTS --- */}
      {showProducts && hasSearched && searchResults.length === 0 && !loading && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No results found.</p>
      )}

      {/* --- PRODUCTS CAROUSEL --- */}
      {showProducts && searchResults.length > 0 && (
        <Slider {...settings} className="products-carousel">
          {searchResults.map(product => (
            <div key={product.link} className="carousel-item">
              <div className="card-product-search">
                <div className="product-image-container-search">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>

                <div className="product-text-search">
                  <div className="rating-votes">
                    <div style={{ display: "flex", justifyContent: "center", gap: 2, color: "#F25E0D", alignItems: "center" }}>
                      <StarIcon size={12} fill="#F25E0D" strokeWidth={1.5} />
                      <StarIcon size={12} fill="#F25E0D" strokeWidth={1.5} />
                      <StarIcon size={12} fill="#F25E0D" strokeWidth={1.5} />
                      <StarIcon size={12} fill="#F25E0D" strokeWidth={1.5} />
                      <StarIcon size={12} strokeWidth={1.5} />
                      <div style={{ fontSize: 14, marginLeft: 10, color: "#737791" }}>
                        <strong>{product.rating}</strong>
                      </div>
                    </div>
                    <div className="product-price">${product.price}</div>
                  </div>

                  <div className="product-title-price">
                    <div className="product-title-search">{truncate(product.title, 100)}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddProduct(product)}
                    className="add-product-to-poll"
                    disabled={addedProduct.includes(product.link)}
                    style={{
                      background: addedProduct.includes(product.link) ? "#B0B6CC" : "",
                    }}
                  >
                    {addedProduct.includes(product.link)
                      ? <Check size={24} strokeWidth={2} />
                      : <Plus size={24} strokeWidth={2} />}
                  </button>

                  <div className="products-link-comments" style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button onClick={() => window.open(product.link, "_blank")} className="product-details-button">
                      <FileText size={16} strokeWidth={2} />
                    </button>
                    <button className="product-details-button">
                      <Bookmark size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
