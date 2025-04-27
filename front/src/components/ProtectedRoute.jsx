import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    console.log(user);

    if (user)
    {
        return children;
    }
    else 
    {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;