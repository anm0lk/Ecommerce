import React, { useContext, useEffect, useState } from 'react'
import { useGetReq } from '../../hooks/useHttp'
import { AuthContext } from '../../context/AuthContext'

const CartAdmin = () => {
    const { token } = useContext(AuthContext);
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllCarts = async () => {
        const data = await useGetReq('admin/carts', token);
        setCarts(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchAllCarts();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-10 px-2">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-8 text-center">All Carts</h1>
                {loading ? (
                    <p className="text-center text-lg text-purple-600">Loading...</p>
                ) : carts.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No carts found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {carts.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center hover:shadow-2xl transition-shadow border border-purple-100">
                                <img
                                    src={item.productImageUrl}
                                    alt={item.productName}
                                    className="h-28 w-28 object-contain rounded-xl shadow-md bg-gradient-to-br from-purple-50 to-pink-50 mb-4 md:mb-0 md:mr-6"
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                        <h2 className="text-xl font-bold text-purple-700">{item.productName}</h2>
                                        <span className="text-sm text-gray-400">Product ID: {item.productId}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mb-2">
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            &#8377; {item.productPrice}
                                        </span>
                                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Qty: {item.quantity}
                                        </span>
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Total: &#8377; {item.totalItemPrice}
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
                                        <div>
                                            <span className="font-semibold text-gray-600">User:</span>
                                            <span className="ml-2 text-purple-700 font-semibold">{item.userName}</span>
                                            <span className="ml-2 text-gray-500 text-sm">({item.userEmail})</span>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 md:mt-0">User ID: {item.userId}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartAdmin