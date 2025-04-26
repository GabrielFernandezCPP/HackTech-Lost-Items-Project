import home_icon from "../../public/assets/home-icon.png"
import logout_icon from "../../public/assets/logout-icon.png"

function Navbar(props) {
    return (
    <>
        <div className={`flex flex-col sticky justify-between w-40 text-xl h-full bg-healthygreen p-3`}>
            <a href="/" className="flex flex-row justify-between items-center text-md text-end bg-offwhite w-full p-1 rounded-sm">
                <img className="h-6" src={home_icon}></img>
                <span>Home</span>
            </a>
            <div>
                <a href="/logout" className="flex flex-row justify-between items-center text-md text-end bg-offwhite w-full p-1 rounded-sm">
                    <img className="h-6" src={logout_icon}></img>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </>
    )
}

export default Navbar
