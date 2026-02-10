import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [search, setSearch] = useState('')
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showToast("Logged out successfully!", "success");
        navigate('/login');
    }
    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate('/');
        }
    }
    const handleLogin = () => navigate('/login');
    const handleSignup = () => navigate('/signup');
    const handleCart = () => navigate('/cart');
    const handleOrders = () => navigate('/orders');
    const handleProfile = () => navigate('/user');
    const handleUsers = () => navigate('/users');
    const handleAdmins = () => navigate('/admins');
    const handleHome = () => navigate('/');

    return (
        <nav className='w-full shadow bg-white sticky top-0 z-30'>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-1" />
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-3 gap-y-2 flex-wrap">
                {/* Logo */}
                <div className="flex items-center gap-2 min-w-0 flex-shrink-0 overflow-hidden mb-2 sm:mb-0">
                    <span
                        onClick={handleHome}
                        className='text-2xl sm:text-3xl flex items-center text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 cursor-pointer tracking-tight select-none whitespace-nowrap'
                        style={{ minWidth: 0 }}
                    >
                        <img
                            src='/logo3.png'
                            alt='Carture logo'
                            className='h-10 sm:h-12 w-auto object-contain mr-2'
                            style={{ maxWidth: 48, minWidth: 32 }}
                        />
                        Carture
                    </span>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 w-full sm:w-auto max-w-xs sm:max-w-sm mx-auto sm:mx-4"
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-3 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50 w-full"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition whitespace-nowrap"
                    >
                        Search
                    </button>
                </form>

                {/* User/Admin Buttons */}
                <div className="flex gap-2 sm:gap-4 flex-wrap items-center justify-end w-full sm:w-auto">
                    {user ? (
                        user.role === 'USER' ? (
                            <>
                                <span
                                    onClick={handleProfile}
                                    className='hidden sm:flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold text-sm shadow mr-2 hover:cursor-pointer'
                                >
                                    <svg className='w-5 h-5 mr-1 text-purple-400' fill='none' stroke='currentColor'><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0 1 13 0" /></svg>
                                    {user.name}
                                </span>
                                <button onClick={handleCart} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Cart</button>
                                <button onClick={handleOrders} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Orders</button>
                                <button onClick={handleProfile} className='sm:hidden px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Profile</button>
                                <button onClick={handleLogout} className='px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 transition shadow'>Logout</button>
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={handleProfile}
                                    className='hidden sm:flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold text-sm shadow mr-2 hover:cursor-pointer'
                                >
                                    <svg className='w-5 h-5 mr-1 text-purple-400' fill='none' stroke='currentColor'><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0 1 13 0" /></svg>
                                    {user.name}
                                </span>
                                <button onClick={handleUsers} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Users</button>
                                <button onClick={handleAdmins} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Admins</button>
                                <button onClick={handleCart} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Carts</button>
                                <button onClick={handleOrders} className='px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Orders</button>
                                <button onClick={handleProfile} className='sm:hidden px-4 py-2 font-semibold rounded-lg text-purple-700 hover:bg-purple-50 hover:text-purple-900 transition'>Profile</button>
                                <button onClick={handleLogout} className='px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 transition shadow'>Logout</button>
                            </>
                        )
                    ) : (
                        <>
                            <button onClick={handleSignup} className='px-3 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition shadow text-white'>Register</button>
                            <button onClick={handleLogin} className='px-3 py-2 bg-pink-500 rounded-md hover:bg-pink-600 transition shadow text-white'>Login</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar