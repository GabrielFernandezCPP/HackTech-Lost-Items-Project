import { createContext, useContext, useEffect, useState } from "react";
import { get_login, get_logout } from "../api/requests.mjs";
const AuthContext = createContext();

const AuthProvider = ({ children }) => 
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false);

    const handleAuthResponse = (response) => {
        if (response.success)
        {
            setUser(response.user);
        }
        else
        {
            setUser(null);
        }

        setLoading(false);
        return response;
    }

    const login = async (email, password) => {
        const user = await get_login(email, password);
        setUser(user);
    }

    const logout = async () => {
        await get_logout();
    }

    return <AuthContext.Provider value={{ user, login, logout, loginAttempted }}>
        {loading ? "Loading..." : children}
    </AuthContext.Provider>
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);