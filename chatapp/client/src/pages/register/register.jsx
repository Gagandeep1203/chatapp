import Axios from "axios";
import "./register.css";
import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../usercontext";

export default function Register() {
    const { setusername, setid } = useContext(UserContext);
    const blobRef = useRef(null);
    
    const [password, setpassword] = useState('');
    const [username, setusernameState] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const handlePointerMove = (event) => {
            const { clientX, clientY } = event;
            if (blobRef.current) {
                blobRef.current.animate(
                    [
                        { transform: `translate(${clientX}px, ${clientY}px)` }
                    ],
                    {
                        duration: 3000,
                        fill: 'forwards'
                    }
                );
            }
        };

        document.body.addEventListener('pointermove', handlePointerMove);
        return () => {
            document.body.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    async function Register1(e) {
        e.preventDefault();
        setError('');  
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        
        setLoading(true);  
        try {
            const { data } = await Axios.post('http://127.0.0.1:3000/register', { username, password });
            setusername(username);
            setid(data._id);
            console.log("done")
        } catch (error) {
            console.error("Error during registration:", error);
            setError('Registration failed. Please try again.'); 
        } finally {
            setLoading(false);  
        }
    }

    return (
        <>
            <div id="blob" ref={blobRef}></div>
            <div id="blob-blur"></div>

            <div id="registercon">
                <form onSubmit={Register1}>
                    <label htmlFor="name">Username:</label>
                    <input
                        type="text"
                        id="name"
                        onChange={(e) => setusernameState(e.target.value)} 
                        aria-required="true"
                    /><br />
                    
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setpassword(e.target.value)} 
                        aria-required="true"
                    /><br />
                    
                    {error && <p className="error">{error}</p>} {/* Error message */}
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    );
} 
