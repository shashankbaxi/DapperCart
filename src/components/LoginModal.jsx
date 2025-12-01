import { useState } from "react";

const LoginModal = ({ onClose, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setStatus("Please fill all fields.");
      return;
    }

    // Fake login success
    setUser({ name: "John Doe", email });
    setStatus("Login successful! Redirecting...");

    setTimeout(() => {
      setStatus("");
      onClose();
    }, 1000);
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="login-close" onClick={onClose}>
          ✕
        </button>
        <h2 className="login-title">Login to DapperCart</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-submit">
            Login
          </button>
        </form>
        {status && <p className="login-status">{status}</p>}
        <p className="login-hint">Demo: test@example.com / any password</p>
      </div>
    </div>
  );
};

export default LoginModal;
