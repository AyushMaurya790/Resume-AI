// src/components/auth/AdminProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin'; // Adjust based on your user role logic
  return isAdmin ? children : <Navigate to="/login" />;
};

export default AdminProtectedRoute;