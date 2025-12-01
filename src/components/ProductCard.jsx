const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price || 0);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "400px",
        transition: "transform 0.2s",
      }}
    >
      {/* ✅ DIRECTLY USE product.image - NO getImage needed */}
      <img
        src={
          product.image ||
          "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Product"
        }
        alt={product.name || "Product"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      />

      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          minHeight: "2.5rem",
        }}
      >
        {product.name || "Product"}
      </h2>

      <p
        style={{
          color: "#4f46e5",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          fontSize: "1.1rem",
        }}
      >
        {formatPrice(product.price)}
      </p>

      <p
        style={{
          color: "#eab308",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        ⭐ {product.rating || 4.5}/5
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          flexGrow: 1,
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
