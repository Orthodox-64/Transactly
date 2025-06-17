import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
}

export const Dashboard = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in");
        navigate("/login");
        return;
      }

      try {
        const balanceResponse:any = await axios.get("http://localhost:3000/account/balance", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setBalance(balanceResponse.data.bankBalance);

        const userResponse:any = await axios.get("http://localhost:3000/auth/getUser", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        
        if (userResponse.data.firstName && userResponse.data.lastName) {
          setUser({
            firstName: userResponse.data.firstName,
            lastName: userResponse.data.lastName
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch data. Please try again.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="container">
      <div className="card">
        <h1>Dashboard</h1>
    
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
    
        {user ? (
          <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>👋 Welcome, {user.firstName} {user.lastName}</h2>
        ) : (
          <p>Loading user info...</p>
        )}
    
        {balance !== null ? (
          <p style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "30px" }}>💰 Current Balance: ₹{balance}</p>
        ) : (
          <p>Loading balance...</p>
        )}

        <button onClick={() => navigate("/send")}>Send Money</button>
      </div>
    </div>
  );
};
