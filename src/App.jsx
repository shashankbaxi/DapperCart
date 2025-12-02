import { useState, useEffect } from "react";
import { products } from "@/data/products.js";
import ProductCard from "./components/ProductCard";
import LoginModal from "./components/LoginModal";
import "./index.css";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entered, setEntered] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const handleDecreaseQty = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("dappercart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCart(parsed);
        }
      } catch {
        // ignore
      } finally {
        setIsLoaded(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dappercart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const cartCount = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price || 0);

  const categories = ["all", "shirts", "pants", "hoodies", "watches", "shoes"];

  const filteredProducts = products
    .filter(
      (product) =>
        (selectedCategory === "all" || product.category === selectedCategory) &&
        (searchTerm.trim() === "" ||
          product.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  if (!isLoaded) {
    return <div className="loading-screen">✨ Loading DapperCart...</div>;
  }

  // WELCOME PAGE
  if (!entered) {
    return (
      <div className={`app ${theme}`}>
        <div className="welcome-page">
          <div className="welcome-hero welcome-enter-animation">
            <h1 className="welcome-logo">🛍️ DapperCart</h1>
            <p className="welcome-tagline">
              Discover premium menswear, curated to make everyday outfits feel
              sharp, confident, and effortless.
            </p>
            <button className="welcome-cta" onClick={() => setEntered(true)}>
              Enter Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className={`app ${theme} main-app-enter`}>
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">🛍️ DapperCart</h1>
          <div className="subtitle">Premium Men's Fashion</div>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className="login-btn" onClick={() => setShowLogin(true)}>
            {user ? `👋 ${user.name}` : "Login"}
          </button>

          <button
            className={`cart-btn ${cartCount > 0 ? "has-items" : ""}`}
            onClick={() => setShowCartPanel(true)}
          >
            🛒 {cartCount}
          </button>

          <button
            className="mobile-search-icon"
            onClick={() => setMobileSearchOpen(true)}
          >
            🔍
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="mobile-menu-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
              <h3 className="mobile-menu-title">Categories</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-category ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                >
                  {cat === "all"
                    ? "All"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {mobileSearchOpen && (
        <div
          className="mobile-search-bar-wrapper"
          onClick={() => setMobileSearchOpen(false)}
        >
          <div
            className="mobile-search-bar"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="mobile-search-close"
              onClick={() => setMobileSearchOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT - FULL WIDTH */}
      <main className="main-content-full">
        <section className="products-section-full">
          <div className="controls-card">
            <div className="products-info">
              {filteredProducts.length} products in{" "}
              <strong>"{selectedCategory}"</strong>
            </div>

            <div className="desktop-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="categories-grid">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                  >
                    {cat === "all"
                      ? "All"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`products-grid-full ${
              filteredProducts.length > 0 ? "" : "empty"
            }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <h3>No products found</h3>
                <p>Try another category</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-heading">About DapperCart</h3>
            <p className="footer-text">
              Premium men's fashion delivered with care. Curated collections
              that fit your lifestyle.
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li>Contact Us</li>
              <li>Shipping & Returns</li>
              <li>FAQs</li>
              <li>Size Guide</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Track Order</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Follow Us</h3>
            <ul className="footer-links">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 DapperCart. All rights reserved.</p>
        </div>
      </footer>

      {/* CART POPUP PANEL */}
      {showCartPanel && (
        <div className="cart-overlay" onClick={() => setShowCartPanel(false)}>
          <div
            className="cart-popup-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cart-popup-close"
              onClick={() => setShowCartPanel(false)}
            >
              ✕
            </button>
            <h2 className="cart-title">🧾 Shopping Cart ({cartCount})</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p className="empty-cart-title">Your cart is empty</p>
                <p>Add items to get started</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() => handleDecreaseQty(item.id)}
                            className="qty-btn qty-minus"
                          >
                            −
                          </button>
                          <span className="qty">{item.quantity}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="qty-btn qty-plus"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="total-row">
                    <span>Total:</span>
                    <span className="total-price">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={() => {
                      setShowCartPanel(false);
                      setShowCheckout(true);
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          className="checkout-overlay"
          onClick={() => setShowCheckout(false)}
        >
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="checkout-close"
              onClick={() => setShowCheckout(false)}
            >
              ✕
            </button>

            <h2 className="checkout-title">🔒 Secure Checkout</h2>

            <div className="checkout-content">
              {/* LEFT SIDE - FORM */}
              <div className="checkout-left">
                {/* CONTACT INFO */}
                <div className="checkout-section">
                  <h3 className="section-title">📧 Contact Information</h3>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="checkout-input"
                  />
                  <label className="checkout-checkbox-label">
                    <input type="checkbox" />
                    <span>Email me with news and offers</span>
                  </label>
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="checkout-section">
                  <h3 className="section-title">🚚 Shipping Address</h3>
                  <div className="input-row">
                    <input
                      type="text"
                      placeholder="First name"
                      className="checkout-input half"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      className="checkout-input half"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    className="checkout-input"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="checkout-input"
                  />
                  <div className="input-row">
                    <input
                      type="text"
                      placeholder="City"
                      className="checkout-input third"
                    />
                    <select className="checkout-input third">
                      <option>Select State</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Gujarat</option>
                      <option>West Bengal</option>
                    </select>
                    <input
                      type="text"
                      placeholder="PIN code"
                      className="checkout-input third"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="checkout-input"
                  />
                </div>

                {/* SHIPPING METHOD */}
                <div className="checkout-section">
                  <h3 className="section-title">📦 Shipping Method</h3>
                  <div className="shipping-options">
                    <label className="shipping-option">
                      <input type="radio" name="shipping" defaultChecked />
                      <div className="shipping-info">
                        <span className="shipping-name">Standard Shipping</span>
                        <span className="shipping-time">5-7 business days</span>
                      </div>
                      <span className="shipping-price">₹100</span>
                    </label>
                    <label className="shipping-option">
                      <input type="radio" name="shipping" />
                      <div className="shipping-info">
                        <span className="shipping-name">Express Shipping</span>
                        <span className="shipping-time">2-3 business days</span>
                      </div>
                      <span className="shipping-price">₹250</span>
                    </label>
                    <label className="shipping-option">
                      <input type="radio" name="shipping" />
                      <div className="shipping-info">
                        <span className="shipping-name">
                          Overnight Delivery
                        </span>
                        <span className="shipping-time">Next day</span>
                      </div>
                      <span className="shipping-price">₹500</span>
                    </label>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="checkout-section">
                  <h3 className="section-title">💳 Payment Method</h3>
                  <div className="payment-methods">
                    <button className="payment-tab active">Credit Card</button>
                    <button className="payment-tab">Debit Card</button>
                    <button className="payment-tab">UPI</button>
                    <button className="payment-tab">Net Banking</button>
                  </div>

                  <div className="payment-form">
                    <input
                      type="text"
                      placeholder="Card number"
                      className="checkout-input"
                      maxLength="19"
                    />
                    <input
                      type="text"
                      placeholder="Cardholder name"
                      className="checkout-input"
                    />
                    <div className="input-row">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="checkout-input half"
                        maxLength="5"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="checkout-input half"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <div className="payment-badges">
                    <span className="badge">🔒 SSL Secure</span>
                    <span className="badge">✅ Verified</span>
                    <span className="badge">💯 Safe Payment</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - ORDER SUMMARY */}
              <div className="checkout-right">
                <div className="order-summary">
                  <h3 className="summary-title">📋 Order Summary</h3>

                  <div className="summary-items">
                    {cart.map((item) => (
                      <div key={item.id} className="summary-item">
                        <div className="summary-item-info">
                          <span className="summary-item-name">{item.name}</span>
                          <span className="summary-item-qty">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="summary-item-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-divider"></div>

                  <div className="promo-code">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="promo-input"
                    />
                    <button className="promo-btn">Apply</button>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>₹100.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (18% GST)</span>
                    <span>{formatPrice(cartTotal * 0.18)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span>
                      {formatPrice(cartTotal + 100 + cartTotal * 0.18)}
                    </span>
                  </div>

                  <button className="place-order-btn">🎉 Place Order</button>

                  <div className="security-note">
                    <p>🔐 Your payment information is secure and encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button className="scroll-top-btn show" onClick={scrollToTop}>
          ⬆️
        </button>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} setUser={setUser} />
      )}
    </div>
  );
}

export default App;
