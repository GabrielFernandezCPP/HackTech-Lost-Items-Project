import home_icon from "../../public/assets/home-icon.png"
import logout_icon from "../../public/assets/logout-icon.png"
import { useAuth } from "./AuthProvider"

function Navbar(props) {
    const { logout } = useAuth();

    return (
    <>
        <div className={`flex flex-col sticky justify-between sm:w-40 text-xl h-full bg-healthygreen p-3`}>
            <a href="/" className="flex flex-row justify-between items-center text-md text-end bg-white w-full p-1 rounded-sm">
                <img className="h-6" src={'#'}></img>
                <span>Home</span>
            </a>
            <div className="flex flex-col space-y-2">
                <a href="/account" className="flex flex-row justify-between items-center text-md text-end bg-white w-full p-1 rounded-sm">
                    <img className="h-6" src={'#'}></img>
                    <span>Account</span>
                </a>
                <a href="/login" onClick={logout} className="flex flex-row justify-between items-center text-md text-end bg-white w-full p-1 rounded-sm">
                    <img className="h-6" src={'#'}></img>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </>
    )
}

export default Navbar
