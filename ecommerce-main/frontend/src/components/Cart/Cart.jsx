import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useDeleteReq, useGetReq, usePostReq } from '../../hooks/useHttp';
import { useToast } from '../../context/ToastContext';

const Cart = () => {

    const { token, user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [cart, setCart] = useState();
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();
    const fetchUserCart = async () => {
        try {
            const data = await useGetReq(`api/cart/view/${user.userId}`, token);
            // console.log(data);
            setCart(data);
            // return data;
        } catch (e) {
            throw new Error(e);
        }
    }
    useEffect(() => {
        fetchUserCart();
    }, [reload]);
    const handleDecrease = async (product) => {
        try {
            if (product.quantity > 1) {
                await usePostReq('api/cart/add', {
                    user: {
                        id: user.userId
                    },
                    product: {
                        productId: product.productId
                    },
                    quantity: product.quantity - 1
                }, token);
            } else {
                await useDeleteReq(`api/cart/remove?userId=${user.userId}&productId=${product.productId}`, token);
            }
            setReload(r => !r);
        } catch (e) {
            throw new Error(e);
        }
    }
    const handleIncrease = async (product) => {
        try {
            await usePostReq('api/cart/add', {
                user: {
                    id: user.userId
                },
                product: {
                    productId: product.productId
                },
                quantity: product.quantity + 1
            }, token);
            setReload(r => !r);
        } catch (e) {
            throw new Error(e);
        }
    }
    const handleRemove = async (product) => {
        try {
            await useDeleteReq(`api/cart/remove?userId=${user.userId}&productId=${product.productId}`, token);
            setReload(r => !r);
        } catch (e) {
            throw new Error(e);
        }
    }
    const handleCheckout = async () => {
        try {
            navigate("/checkout",{state:{cart}});
            // await usePostReq(`api/orders/${user.userId}`, null, token);
            setReload(r => !r);
        } catch (e) {
            throw new Error(e);
        } finally {
            showToast("Order successful!", "success");
            // navigate('/orders');
        }
    }
    const handleClearCart = async () => {
        try {
            await useDeleteReq(`api/cart/removeAll?userId=${user.userId}`, token);
            setReload(r => !r);
            showToast("Cart cleared!","success");
        } catch (e) {
            throw new Error(e.response);
        }
    }
    return (
        <div className='p-6 bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen'>
            <h1 className='text-4xl font-bold text-center text-purple-800 mb-8'>Your Cart</h1>
            {cart && cart.items && cart.items.length > 0 ?
                <div className="flex flex-col mx-auto max-w-4xl gap-8">
                    {cart.items.map(item => (
                        <div key={item.productId} className='flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden'>
                            <div className="md:w-1/3 flex items-center justify-center bg-purple-50 p-4">
                                <img src={item.productImageUrl} alt={item.productId} className='h-48 w-48 object-contain' />
                            </div>
                            <div className="md:w-2/3 flex flex-col justify-between p-6">
                                {/* Product Name */}
                                <p className='text-3xl font-semibold text-purple-800 mb-4'>{item.productName}</p>
                                {/* Product Details */}
                                <div className="text-center text-lg flex flex-col sm:flex-row sm:gap-8 space-y-2 sm:space-y-0 mb-4">
                                    <p className=' text-gray-600'>Price: <span className='font-semibold'>&#8377; {item.productPrice}</span></p>
                                    <div className='text-gray-600'>
                                        Quantity:
                                        <span> <button onClick={() => handleDecrease(item)} className='shadow bg-purple-200 px-4 hover:bg-purple-100 transition-colors tranisition-200'>-</button></span>
                                        <span className='font-semibold'> {item.quantity} </span>
                                        <span><button onClick={() => handleIncrease(item)} className='shadow bg-purple-200 px-4 hover:bg-purple-100 transition-colors tranisition-200'>+</button></span>
                                    </div>
                                    <p className='text-gray-600'>Total: <span className='font-semibold'>&#8377; {item.totalItemPrice}</span></p>
                                </div>
                                <div className="text-end">
                                    <button className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition-colors transition-300' onClick={() => handleRemove(item)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='text-end text-lg text-purple-800 font-bold'><span className='bg-purple-100 rounded-xl p-4 shadow'>Total Price: &#8377; {cart.totalPrice}</span></div>
                    <div className="flex justify-end gap-4">
                        <button className='shadow hover:shadow-lg bg-purple-600 rounded-lg px-6 py-3 text-white' onClick={handleCheckout}>Checkout Cart</button>
                        <button className='shadow hover:shadow-lg bg-red-500 rounded-lg px-6 py-3 text-white' onClick={handleClearCart}>Clear Cart</button>
                    </div>
                </div> : <p className='text-center text-lg text-gray-500 mt-12'>Cart Items not found</p>
            }
        </div>
    )
}

export default Cart
