import React, { useContext, useEffect, useState } from 'react'
import { useDeleteReq, useGetReq } from '../../hooks/useHttp'
import { AuthContext } from '../../context/AuthContext'
import Loader from '../Loader/Loader';

const ProfileUsers = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const data = await useGetReq('admin/users', token);
            setUsers(data);
        } finally {
            setLoading(false);
        }
    }
    const removeUser=async(userId)=>{
        try{
            setLoading(true);
            await useDeleteReq(`admin/delete/${userId}`,token);
        }finally{
            setLoading(false);
            setReload(r=>!r);
        }
    }
    useEffect(() => {
        fetchAllUsers();
    }, [reload])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-10 px-2">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-8 text-center">All Users</h1>
                {loading ? (
                    <Loader />
                ) : users.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {users.map(user => (
                            <div key={user.userId} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:shadow-2xl transition-shadow border border-purple-100">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-3">
                                    <span className="text-white text-3xl font-bold">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                                </div>
                                <h2 className="text-xl font-bold text-purple-700 mb-1">{user.name}</h2>
                                <p className="text-gray-500 text-sm mb-2">{user.email}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 ${user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {user.role}
                                </span>
                                <div className="w-full flex flex-col gap-1 mt-2 text-sm">
                                    <div>
                                        <span className="font-semibold text-gray-600">User ID:</span>
                                        <span className="ml-2 text-gray-500">{user.userId}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Payment:</span>
                                        <span className="ml-2 text-gray-500">{user.paymentDetails || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600">Address:</span>
                                        <span className="ml-2 text-gray-500">{user.shippingAddress || 'N/A'}</span>
                                    </div>
                                </div>
                                <button onClick={()=>removeUser(user.userId)} className='bg-red-500 mt-4 rounded-lg px-2 py-3 text-white shadow-lg hover:bg-red-300 border-red-700 hover:border-red-500'>Remove</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileUsers