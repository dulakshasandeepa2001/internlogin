import { useState } from "react";
import "./App.css";
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    
    const [showPassword, setShowPassword] = useState(false);
    
    const fullfillsubmit = async (e) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            alert("Please fill in all fields");
            return;
        }
        // Add your login logic here
        console.log("Login submitted:", data);
        // Navigate to dashboard after successful login
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                   Login 
                </h2>
                <form className="login-form" onSubmit={fullfillsubmit}>
                    <div className="form-inputs">
                        <div className="input-group">
                            <label className="sr-only">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData({...data, email: e.target.value})}
                                required
                                className="form-input"
                                placeholder="Email"
                            />
                        </div>
                        <div className="input-group password-group">
                            <label className="sr-only">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData({...data, password: e.target.value})}
                                required
                                className="form-input password-input"
                                placeholder="Password"
                            />
                            <div 
                                className="password-toggle"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ?  <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;