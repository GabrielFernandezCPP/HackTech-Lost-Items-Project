import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user, loaded } = useAuth();
    const location = useLocation();

    if (!loaded)
        return null;

    if (user)
    {
        return children;
    }
    else 
    {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
};

export default ProtectedRoute;