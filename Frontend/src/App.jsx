import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [products, setProducts] = useState([]);
  const [preferences, setPreferences] = useState("");
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!preferences.trim()) return;

    setLoading(true);
    setError("");
    setRecommendedIds([]);
    setRecommendedProducts([]);

    try {
      const res = await fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setRecommendedIds(data.ids || []);
      setRecommendedProducts(data.recommendedProducts || []);
    } catch (err) {
      console.error(err);
      setError("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  const isRecommended = (id) => recommendedIds.includes(id);

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>AI Product Recommendation Demo</h1>
      <p style={{ color: "#555" }}>
        Type your preferences (e.g. <i>"I want a phone under $500"</i>) and let the AI suggest products.
      </p>

      <form onSubmit={handleRecommend} style={{ margin: "1.5rem 0" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Your preferences:
        </label>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows={3}
          placeholder='e.g. "I want a phone under $500 that is good for gaming"'
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          disabled={loading || !preferences.trim()}
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "none",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Getting recommendations..." : "Get Recommendations"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>Recommended Products</h2>
          <ul>
            {recommendedProducts.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — ${p.price} ({p.category})
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>All Products</h2>
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {products.map((p) => (
              <li
                key={p.id}
                style={{
                  marginBottom: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  backgroundColor: isRecommended(p.id) ? "#e6ffe6" : "#fff",
                }}
              >
                <strong>{p.name}</strong> — ${p.price} ({p.category})
                {isRecommended(p.id) && (
                  <span style={{ marginLeft: 8 }}>⭐ Recommended</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
