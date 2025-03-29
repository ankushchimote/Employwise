import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://reqres.in/api/users?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.data);
        setFilteredUsers(data.data); // Initialize filtered users with all users
        setTotalPages(data.total_pages);
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      }
    };
    fetchUsers();
  }, [page]);
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchQuery = e.target.value.toLowerCase();
    const filtered = users.filter(user => 
      user.first_name.toLowerCase().includes(searchQuery) ||
      user.last_name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
    );
    setFilteredUsers(filtered);
  };
  

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
  
      // Manually remove the user from state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  
      setMessage({ type: "success", text: "User deleted successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    navigate("/"); // Redirect to login page
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
  
    try {
      const res = await fetch(`https://reqres.in/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update user");
  
      // Manually update the state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
      
      setFilteredUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
  
      setEditingUser(null);
      setMessage({ type: "success", text: "User updated successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 flex flex-col items-center p-6 font-sans">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Users List</h2>

      <button onClick={handleLogout} className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition">
        Logout
      </button>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="mt-4 mb-4 p-3 border border-gray-300 rounded-lg shadow-sm w-80 text-gray-700 focus:ring-2 focus:ring-purple-400"
      />
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg shadow-md text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-xl transform transition hover:scale-105">
            <img src={user.avatar} alt={user.first_name} className="w-24 h-24 rounded-full mx-auto border-4 border-purple-400" />
            <h3 className="text-xl font-semibold mt-3 text-center text-gray-800">{user.first_name} {user.last_name}</h3>
            <p className="text-gray-500 text-center">{user.email}</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => handleEditClick(user)} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg shadow hover:bg-yellow-500 transition">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow disabled:bg-gray-400">
          Previous
        </button>
        <span className="px-4 py-2 bg-white rounded-lg shadow text-gray-700">{page} / {totalPages}</span>
        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow disabled:bg-gray-400">
          Next
        </button>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit User</h3>
            
            <label className="block font-medium mb-1 text-gray-700">First Name</label>
            <input 
              className="border p-3 w-full mb-2 rounded-lg shadow-sm" 
              value={formData.first_name} 
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
              placeholder="First Name" 
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

            <label className="block font-medium mb-1 text-gray-700">Last Name</label>
            <input 
              className="border p-3 w-full mb-2 rounded-lg shadow-sm" 
              value={formData.last_name} 
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
              placeholder="Last Name" 
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

            <label className="block font-medium mb-1 text-gray-700">Email</label>
            <input 
              className="border p-3 w-full mb-2 rounded-lg shadow-sm" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="Email" 
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <div className="flex justify-between mt-4">
              <button onClick={handleUpdate} className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition">Update</button>
              <button onClick={() => setEditingUser(null)} className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;


