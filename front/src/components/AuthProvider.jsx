import { createContext, useContext, useEffect, useState } from "react";
import { check_auth, get_login, get_logout } from "../api/requests.mjs";
const AuthContext = createContext();

const AuthProvider = ({ children }) => 
{
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false);

    const check_auth_effect = async () => {
        let user_email = await check_auth();
        setUser(user_email);
        setLoaded(true);
    }

    useEffect(() => {
        check_auth_effect();   
    }, []);

    const login = async (email, password) => {
        const response_email = await get_login(email, password);
        setUser(response_email);
    }

    const logout = async () => {
        await get_logout();
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, login, logout, loaded, loginAttempted }}>
        {!loaded ? "Loading..." : children}
    </AuthContext.Provider>
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);