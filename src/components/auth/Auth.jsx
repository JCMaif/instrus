import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth} from "../../config/firebase";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/players");
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            console.log("connecté : ", auth?.currentUser?.email);
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <input
                type="email"
                className="auth-input"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="auth-input"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-button" onClick={signIn}>
                Login
            </button>
        </div>
    );
};
