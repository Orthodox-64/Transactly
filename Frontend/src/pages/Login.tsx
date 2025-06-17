import React from "react"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Login=()=>{
    const [firstName,setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password,setPassword]=React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const user={
            firstName:firstName,
            lastName: lastName,
            password:password,
        }
        try {
            const response:any = await axios.post("http://localhost:3000/auth/login", user);
            console.log(response.data);
            if(response.data.token){
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to login. Please check your credentials and try again.");
            }
        }
    }

    return (
        <div className="container">
            <div className="card">
                <h1>Login</h1>
                {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p style={{ marginTop: "20px" }}>
                    Don't have an account? <Link to="/signup">Create one here</Link>
                </p>
            </div>
        </div>
    );
};
