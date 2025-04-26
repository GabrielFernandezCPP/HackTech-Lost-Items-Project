import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

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