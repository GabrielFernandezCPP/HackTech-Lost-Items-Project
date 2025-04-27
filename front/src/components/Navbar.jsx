import { useLocation } from "react-router-dom";
import home_icon from "../../public/assets/home-icon.png"
import logout_icon from "../../public/assets/logout-icon.png"
import { useAuth } from "./AuthProvider"

function Navbar(props) {
    const { logout, user } = useAuth();
    const location = useLocation();

    const render_navbar = !(
        user == null ||
        location.pathname.startsWith("/lost")
    );

    if (!render_navbar)
        return null;

    return (
    <>
        <div className={`flex flex-col sticky justify-between sm:w-40 text-xl h-full bg-healthygreen p-3`}>
            <a href="/" className="flex flex-row justify-center items-center text-md bg-white w-full p-1 rounded-sm">
                <span>Home</span>
            </a>
            <div className="flex flex-col space-y-2">
                <a href="/account" className="flex flex-row justify-center items-center text-md bg-white w-full p-1 rounded-sm">
                    <span>Account</span>
                </a>
                <a href="/login" onClick={logout} className="flex flex-row justify-center items-center text-md bg-white w-full p-1 rounded-sm">
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </>
    )
}

export default Navbar
