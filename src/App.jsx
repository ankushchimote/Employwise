import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import UsersList from './components/UsersList';
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<PrivateRoute element={<UsersList />} />} />
      </Routes>
    </Router>
  );
}

export default App;
