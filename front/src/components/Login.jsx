import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Auth = () => 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login, loginAttempted, user } = useAuth();

    const handleLogin = async (element) => {
        element.preventDefault();
        await login(email, password);
        if (user != null)
            await navigate("/dashboard");
    };

    return <>
        <div className="flex justify-center w-screen h-screen align-middle">
            <form className="shadow-black flex flex-col gap-4 p-4 w-[80%] mt-32" onSubmit={handleLogin}>
                <h1 className="p-2 text-2xl text-black">Sign In</h1>
                <input className="bg-gray-300 p-2" type="text" placeholder="Email" onChange={(element) => {setEmail(element.target.value)}} value={email} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <p className={`text-red-500 ${loginAttempted && !user ? "visible" : "invisible"}`}>Invalid email or password</p>
                <button className="bg-citrus-blue bg-secondary-gray text-black hover:bg-secondary-green p-2" type="submit">Log In</button>
                <span>
                    Need an account? Create one <a className="bg-citrus-blue text-blue-700" href="/register">here</a>
                </span>
            </form>
        </div>
    </>
};

export default Auth;
