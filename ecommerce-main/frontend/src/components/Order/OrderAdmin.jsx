import React, { useContext, useEffect, useState } from 'react'
import { useDeleteReq, useGetReq, usePostReq } from '../../hooks/useHttp';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

const OrderAdmin = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState();
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const data = await useGetReq('admin/orders', token);
            setOrders(data.reverse());
        } finally { 
            setLoading(false); 
        }
    }
    const deleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await useDeleteReq(`admin/orders/${orderId}`, token);
            setReload(r => !r);
        }
    }
    const updateOrderStatus = async (orderId) => {
        await usePostReq(`admin/orders/status/${orderId}?status=DELIVERED`, null, token);
        setReload(r => !r);
    }
    const updatePaymentStatus = async (orderId) => {
        await usePostReq(`admin/orders/payment/${orderId}?payment=PAID`, null, token);
        setReload(r => !r);
    }

    useEffect(() => {
        fetchAllOrders();
    }, [reload])

    return (
        <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-6 min-h-screen">
            {loading ? <Loader text='Loading...' /> :
                <div className=""><h1 className="text-4xl font-bold text-purple-800 mb-10 text-center tracking-tight">All Orders</h1>
                    {orders && orders.length > 0 ? (
                        <div className="space-y-12 max-w-5xl mx-auto">
                            {orders.map(order => (
                                <div key={order.orderId} className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow border border-purple-100">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center text-sm mb-6 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                                <span className='font-semibold text-gray-700'>Order ID:</span>
                                                <span className='text-gray-500'>{order.orderId}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                                <span className='font-semibold text-gray-700'>User:</span>
                                                <span className='text-gray-500'>{order.userName} ({order.userEmail})</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                                <span className='font-semibold text-gray-700'>User ID:</span>
                                                <span className='text-gray-500'>{order.userId}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                                <span className='font-semibold text-gray-700'>Order Date:</span>
                                                <span className='text-gray-500'>{order.orderDate}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                                                <span className='font-semibold text-gray-700'>Shipping Address:</span>
                                                <span className='text-gray-500'>{order.shippingAddress}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center mt-4 md:mt-0">
                                            <span className={`rounded-full px-3 py-1 font-semibold text-xs md:text-sm ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.orderStatus}</span>
                                            <span className={`rounded-full px-3 py-1 font-semibold text-xs md:text-sm ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.paymentStatus}</span>
                                            <div className="flex gap-2 mt-2 md:mt-0">
                                                <button
                                                    onClick={() => updateOrderStatus(order.orderId)}
                                                    disabled={order.orderStatus === 'DELIVERED'}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold shadow transition text-xs md:text-sm
                                                ${order.orderStatus === 'DELIVERED'
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-purple-600 text-white hover:bg-purple-700'}
                                            `}
                                                    title="Mark as Delivered"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                    Delivered
                                                </button>
                                                <button
                                                    onClick={() => updatePaymentStatus(order.orderId)}
                                                    disabled={order.paymentStatus === 'PAID'}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold shadow transition text-xs md:text-sm
                                                ${order.paymentStatus === 'PAID'
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-green-600 text-white hover:bg-green-700'}
                                            `}
                                                    title="Mark as Paid"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                                                    Paid
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order.orderId)}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition text-xs md:text-sm"
                                                    title="Delete Order"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="text-left border-separate border-spacing-y-2 min-w-full">
                                            <thead>
                                                <tr className='bg-purple-100'>
                                                    <th className='py-3 px-4 rounded-l-lg'>Product</th>
                                                    <th className='py-3 px-4'>Image</th>
                                                    <th className='py-3 px-4'>Price</th>
                                                    <th className='py-3 px-4'>Quantity</th>
                                                    <th className='py-3 px-4 rounded-r-lg'>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderItems.map((item, idx) => (
                                                    <tr key={item.orderItemId} className={`transition ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50`}>
                                                        <td className='px-4 py-3 font-medium text-gray-800 max-w-xs truncate'>
                                                            <span className='block'>{item.productName}</span>
                                                            {item.productBrand && (
                                                                <span className='text-xs text-gray-400'>{item.productBrand}</span>
                                                            )}
                                                        </td>
                                                        <td className='px-2 py-3 overflow-hidden'>
                                                            <img src={item.productImageUrl} alt={item.productName} className='h-20 w-20 object-contain border shadow-sm bg-white rounded-xl' />
                                                        </td>
                                                        <td className='px-4 py-3 text-gray-700 whitespace-nowrap'>&#8377; {item.productPrice}</td>
                                                        <td className='px-4 py-3 text-gray-700 whitespace-nowrap'>{item.quantity}</td>
                                                        <td className='px-4 py-3 text-purple-700 font-semibold whitespace-nowrap'>&#8377; {item.totalPrice}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='text-right mt-6'>
                                        <span className='text-xl font-bold text-purple-800 bg-purple-50 rounded-lg shadow px-6 py-3'>Order Total: &#8377; {order.totalPrice}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No orders found.</p>
                    )}</div>}
        </div>
    )
}

export default OrderAdmin