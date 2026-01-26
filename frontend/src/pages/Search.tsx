import { useState } from "react";
import { authFetch } from "../utils/auth";
import type { SearchProps, ProductSearch } from "../utils/types";
import { useParams } from "react-router-dom";


const truncate = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

export default function Search({ userSearch }: SearchProps) {
    const { uuid } = useParams<{ uuid: string }>();

    const [userInput, setUserInput] = useState(userSearch ?? "");
    const [searchResults, setSearchResults] = useState<ProductSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [showProducts, setShowProducts] = useState(false)

    const handleSearch = async () => {
        if (showProducts) {
            setShowProducts(false)
            return
        }

        const value = userInput.trim();
        console.log("Searching for:", userInput);
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
                alert(
                    data.detail ||
                    data.error ||
                    "Request failed"
                );
                console.error("API error:", data);
                return;
            }

            setSearchResults(data);
            setShowProducts(true)
            console.log("Search results:", data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            
        }
    };

    const handleAddProduct = async (product: ProductSearch) => {
        try {
            const response = await authFetch(
                `http://127.0.0.1:8000/${uuid}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: product.title,
                    link: product.link,
                    image: product.image,
                    rating: product.rating,
                    price: product.price,
                }
                ),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.detail ||
                    data.error ||
                    "Request failed"
                );
                console.error("API error:", data);
                return;
            }


            alert("Product succesfully added")
            console.log("Product added:", data);


        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            {/* <div className="wrap-search">*/}


            {/* <a href={`/${uuid}`}>Back to poll</a> */}


            <div className="search-bar">
                <input id="search" className="search-product" type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Wireless Headphones" />
                <button onClick={handleSearch} disabled={loading}>{loading ? "Loading..." : !showProducts ? "Search": "Hide"}</button>
            </div>

            {showProducts && hasSearched && searchResults.length === 0 && !loading && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>No results found.</p>
            )}
            {showProducts && searchResults.map((product) => (
                <div key={product.link} style={{ marginBottom: "16px", display: 'flex', justifyContent: 'center' }}>
                    <div className="card-product">

                        <div className="product-image-container">
                            <img src={product.image} alt={product.title} className="product-image" />
                        </div>

                        <div className="product-text">
                            <div className="product-title-price">
                                <div className="product-title">{truncate(product.title, 60)}</div>
                                <div className="product-price"> ${product.price}</div>
                            </div>

                            <div className="product-rating"><div style={{ color: '#FF6A00' }}>★★★★★ </div> <strong>{product.rating}</strong> (2,345 reviews)</div>


                            <div>
                                <button type="button" onClick={() => handleAddProduct(product)} className="add-product-to-poll">{product ? "Add product to Poll!" : "Added!"}</button>
                            </div>

                            <div className="products-link-comments">

                                <button onClick={() => window.open(product.link, "_blank")} className="product-details-button">Details</button>
                                <button className="product-details-button">Save</button>


                            </div>
                        </div>

                    </div>

                </div>
            ))}
            {/* </div> */}
            {/* </div> */}

        </>
    );
}