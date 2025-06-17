import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SendMoney = () => {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in");
      return;
    }

    try {
      const response:any = await axios.post(
        "http://localhost:3000/account/transfer",
        {
          amount: Number(amount),
          to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        setMessage(response.data.message);
        setAmount("");
        setTo("");
        setError("");
      }
    } catch (err: any) {
      setMessage("");
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Transfer failed. Try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Send Money</h2>
        <form onSubmit={handleTransfer}>
          <input
            type="text"
            placeholder="Recipient's Last Name"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit">Transfer</button>
        </form>

        {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        <button onClick={() => navigate("/dashboard")} style={{ marginTop: "20px", backgroundColor: "#6c757d" }}>Back to Dashboard</button>
      </div>
    </div>
  );
};