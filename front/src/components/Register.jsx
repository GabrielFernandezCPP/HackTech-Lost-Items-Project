import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Auth = () => 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register, loginAttempted, user } = useAuth();

    const handleRegister = async (element) => {
        element.preventDefault();
        if (password != verifyPassword)
        {
            console.log("Passwords don't match");
            return;
        }
        
        setLoading(true);
        var check = await register(username, password);
        setLoading(false);

        if (check != null)
        {
            await navigate("/dashboard");
        }
        else console.log("!---------- User already exists!!! ------------!");
    }

    return <>
        <div className="flex justify-center w-screen h-screen align-middle">
            <form className="shadow-black flex flex-col gap-4 p-4 w-[80%] mt-32" onSubmit={handleRegister}>
                <h1 className="p-2 text-2xl text-black">Create a New Account</h1>
                <input className="bg-gray-300 p-2" type="email" placeholder="Email" onChange={(element) => {setUsername(element.target.value)}} value={username} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Verify Password" onChange={(element) => {setVerifyPassword(element.target.value)}} value={verifyPassword} required />
                <button className={`bg-citrus-blue bg-secondary-gray text-black hover:bg-secondary-green ${loading ? 'animate-pulse' : null} p-2`} type="submit">{`${loading ? '...' : 'Register'}`}</button>
                <span>
                    Have an account? Sign in <a className="bg-citrus-blue text-blue-700" href="/login">here</a>
                </span>
            </form>
        </div>
    </>
};

export default Auth;
