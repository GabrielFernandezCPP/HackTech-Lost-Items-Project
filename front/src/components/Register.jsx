import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Auth = () => 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login, register, loginAttempted, user } = useAuth();

    const handleLogin = async (element) => {
        element.preventDefault();
        await login(username, password);
        await navigate("/dashboard");
    };

    const handleRegister = async (element) => {
        element.preventDefault();
        var check = await register(username, password);
        
        if (check != null)
        {
            await login(username, password);
            await navigate("/dashboard");
        }
        else console.log("!---------- User already exists!!! ------------!");
    }

    return <>
        <div className="flex justify-center w-screen h-screen align-middle">
            <form className="shadow-black flex flex-col gap-4 p-4 w-[80%] mt-32" onSubmit={handleRegister}>
                <h1 className="p-2 text-2xl text-black">Create a New Account</h1>
                <input className="bg-gray-300 p-2" type="text" placeholder="Email" onChange={(element) => {setUsername(element.target.value)}} value={username} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Verify Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <button className="bg-citrus-blue bg-secondary-gray text-black hover:bg-secondary-green active:animate-ping p-2" type="submit">Register</button>
                <span>
                    Have an account? Sign in <a className="bg-citrus-blue text-blue-700" href="/login">here</a>
                </span>
            </form>
        </div>
    </>
};

export default Auth;
