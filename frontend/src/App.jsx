import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : `${window.location.origin}/api`)
).replace(/\/$/, "");

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/get-products`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message ||
          `Failed to load products from ${API_BASE}/get-products`
      );
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/save-products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          `Failed to save products using ${API_BASE}/save-products`
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy-block">
          <p className="eyebrow">Product Dashboard</p>
          <h1>MongoDB Products Overview</h1>
          <p className="hero-copy">
            Clean product table, quick refresh, and sample data loading in one
            simple frontend screen.
          </p>
          <div className="action-row">
            <button className="action-button" onClick={loadProducts} disabled={loading}>
              {loading ? "Loading..." : "Refresh Data"}
            </button>
            <button
              className="action-button secondary"
              onClick={saveProducts}
              disabled={saving}
            >
              {saving ? "Saving..." : "Load Sample Data"}
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span className="stat-label">Total Products</span>
            <strong className="stat-value">{products.length}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Combined Value</span>
            <strong className="stat-value">${totalValue.toFixed(2)}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Status</span>
            <strong className="stat-value">
              {loading ? "Syncing" : products.length > 0 ? "Ready" : "Empty"}
            </strong>
          </article>
        </div>
      </section>

      {error && <p className="status-message error-message">{error}</p>}
      {!error && (
        <p className="status-message api-message">
          API Base: <code>{API_BASE}</code>
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="status-message">
          Abhi koi product nahi mila. <code>Load Sample Data</code> button dabao,
          ya backend ka <code>/api/save-products</code> route hit karo.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="table-section">
          <div className="table-toolbar">
            <div>
              <p className="toolbar-label">Live Collection</p>
              <h2>Products Table</h2>
            </div>
            <span className="toolbar-badge">{products.length} records</span>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id ?? `${product.title}-${index}`}>
                    <td className="serial-cell">{index + 1}</td>
                    <td>
                      <div className="image-shell">
                        <img
                          className="table-image"
                          src={product.image}
                          alt={product.title}
                        />
                      </div>
                    </td>
                    <td className="title-cell">{product.title}</td>
                    <td className="price-cell">${product.price}</td>
                    <td className="description-cell">{product.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
