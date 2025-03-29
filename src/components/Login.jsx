import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    // Manually check credentials before making the API call
    if (email !== "eve.holt@reqres.in" || password !== "cityslicka") {
      setError("Invalid username or password");
      return;
    }
  
    try {
      const response = await axios.post("https://reqres.in/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/users");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
