
import { useEffect, useState } from "react";
import type { Poll } from "../utils/types";
import type { Product } from "../utils/types";
import { authFetch } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


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


    return (
        <>
            <h1>{poll.title}</h1>
            <div className="poll-description">
                <p>Budget: ${poll.budget}</p>
                <h2>Products</h2>
                <div>
                    <button
                        onClick={() => navigate("/search")}
                        className="add-product"
                    >
                        Add Product
                    </button>
                </div>

            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {products.map(product => (
                    <li key={product.id} style={{ marginBottom: "16px" }}>
                        <div className="card-product">
                            <img src={product.image} alt={product.title} className="product-image" />
                            <div className="product-text">
                                <div className="product-title">{truncate(product.title, 60)}</div>
                                <div className="product-price">${product.price}</div>
                                <div className="product-rating">⭐ {product.rating}</div>
                                <div className="products-link-comments">
                                    <a href={product.link}>Details</a>
                                    <a href="">Comments</a>
                                    <button onClick={() => handleDeleteProduct(String(product.id))}>Delete</button>
                                </div>
                            </div>
                            <button className="vote">Vote!</button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};


