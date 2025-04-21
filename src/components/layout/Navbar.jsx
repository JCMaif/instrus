import {Link} from "react-router-dom";
import {auth} from "../../config/firebase";
import {signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "./Navbar.css";
import {useEffect, useRef, useState} from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>

            <button
                ref={buttonRef}
                className="menu-button"
                aria-label="Ouvrir le menu"
                aria-expanded={menuOpen}
                aria-controls="nav-menu"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                &#9776;
            </button>

            <nav
                className={`nav ${menuOpen ? "open" : ""}`}
                ref={menuRef}
                id="nav-menu"
                role="navigation"
                aria-label="Menu principal"
            >
                <ul>
                    <li><Link to="/players">Joueurs</Link></li>
                    <li><Link to="/instruments">Instruments</Link></li>
                    <li><Link to="/tripods">Trépieds</Link></li>
                    <li><Link to="/loans">Prêts</Link></li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        </>
    )
        ;
};

export default Navbar;
