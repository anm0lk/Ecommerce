import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { usePostReq } from '../../hooks/useHttp';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Loader from '../Loader/Loader';

const Login = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { role, dispatch } = useContext(AuthContext);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (role) {
            const timer = setTimeout(() => navigate('/user', { replace: true }), 1800);
            return () => clearTimeout(timer);
        }
    }, [role, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        if (error) setError('');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await usePostReq("api/user/login", user);
            dispatch({
                type: "LOGIN",
                payload: {
                    user: response.user,
                    token: response.token,
                    role: response.role,
                }
            });
            localStorage.setItem("token", response.token);
            localStorage.setItem("user",JSON.stringify(response.user));
            localStorage.setItem("role", response.role);
            showToast("Login successful!", "success");
            navigate("/");
        } catch (e) {
            setError(e.message || "Login failed. Please try again.");
            showToast("Login failed. Please try again.","error")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
                {loading && <Loader text="Logging in..." />}
                <div className={loading ? 'opacity-40 pointer-events-none' : ''}>
                    {role ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-3">
                                <span className="text-white text-3xl font-bold">😊</span>
                            </div>
                            <h2 className="text-2xl font-bold text-purple-700 mb-2">You're already logged in!</h2>
                            <p className="text-gray-500 mb-4 text-center">Redirecting to your profile...</p>
                            <Link
                                to="/user"
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:from-purple-500 hover:to-pink-400 transition"
                            >
                                Go to Profile
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-2">
                                    <span className="text-white text-3xl font-bold">🔒</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">Welcome Back</h2>
                                <p className="text-gray-400 text-sm">Sign in to your account</p>
                            </div>
                            {error && (
                                <div className="mb-4">
                                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-center animate-shake">
                                        {error}
                                    </div>
                                </div>
                            )}
                            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full px-4 py-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow hover:from-purple-500 hover:to-pink-400 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>
                            <p className="text-center text-sm md:text-lg mt-6">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-purple-600 hover:text-pink-500 font-semibold transition">
                                    Register
                                </Link>
                            </p>
                        </>
                    )}
                </div>
                {/* Shake animation for error */}
                <style>
                    {`
                    @keyframes shake {
                        0% { transform: translateX(0); }
                        20% { transform: translateX(-8px); }
                        40% { transform: translateX(8px); }
                        60% { transform: translateX(-8px); }
                        80% { transform: translateX(8px); }
                        100% { transform: translateX(0); }
                    }
                    .animate-shake {
                        animation: shake 0.3s;
                    }
                    `}
                </style>
            </div>
        </div>
    )
}

export default Login