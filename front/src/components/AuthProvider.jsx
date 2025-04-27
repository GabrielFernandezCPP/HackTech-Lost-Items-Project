import { createContext, useContext, useEffect, useState } from "react";
import { check_auth, get_login, get_logout, register_user } from "../api/requests.mjs";
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
        return response_email;
    }

    const register = async (email, password) => {
        const response_email = await register_user(email, password);
        setUser(response_email);
        return response_email;
    }

    const logout = async () => {
        await get_logout();
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, login, register, loaded, logout, loginAttempted }}>
        {!loaded ? <div className="text-center p-10">Loading page...</div> : children}
    </AuthContext.Provider>
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);