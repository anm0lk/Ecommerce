import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetReq, usePostReq } from '../../hooks/useHttp';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader/Loader';
import { useToast } from '../../context/ToastContext';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, token } = useContext(AuthContext);
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);

    const fetchProductDetails = async () => {
        try {
            const data = await useGetReq(`api/products/get/${productId}`, null, token);
            setProduct(data);
            return data;
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = async (product) => {
        try {
            if (user) {
                setLoading(true);
                const cartItems = await useGetReq(`api/cart/view/${user.userId}`, token);
                const productInCart = cartItems?.items?.find(item => item.productId === product.productId);
                const existingQuantity = productInCart ? productInCart.quantity : 0;
                await usePostReq(`api/cart/add`, {
                    user: {
                        id: user.userId
                    },
                    product: {
                        productId: product.productId
                    },
                    quantity: existingQuantity + 1,
                }, token);
            }
            else {
                navigate('/login')
            }
        } finally {
            setLoading(false);
            if (user)
                showToast("Product added to cart!", "success")
        }
    }

    const handleAddOrder = async (product) => {
        try {
            if (user) {
                setLoading(true);
                navigate("/checkout",{state:{product}})
                // await usePostReq(`api/orders/${user.userId}/${product.productId}`, null, token);
            }
            else {
                navigate('/login')
            }
        } finally {
            setLoading(false);
            // if (user) {
            //     showToast("Order succesfull!", "success")
            //     navigate('/orders');
            // }
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId])

    return (
        <div className="bg-gradient-to-b from-purple-50 to-pink-100 min-h-screen flex items-center justify-center py-8">
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12">
                    {product ? (
                        <div>
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                                <div className="w-full md:w-1/2 flex justify-center items-center">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="object-contain h-72 md:h-[420px] w-full transition-transform duration-300 hover:scale-110 shadow-2xl rounded-2xl"
                                    />
                                    {product.isNew && (
                                        <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                            New
                                        </span>
                                    )}
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start">
                                    <span className="uppercase text-xs font-semibold text-purple-400 tracking-widest mb-2">{product.category}</span>
                                    <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-4">{product.name}</h1>
                                    <p className="text-lg md:text-xl text-gray-600 mb-6">{product.description}</p>
                                    <div className="flex items-center gap-4 mb-8">
                                        {product.discount ? (
                                            <>
                                                <span className="text-xl md:text-2xl font-semibold text-gray-400 line-through">&#8377; {product.originalPrice}</span>
                                                <span className="text-2xl md:text-4xl font-bold text-purple-700">&#8377; {product.price}</span>
                                                <span className="text-lg text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg">
                                                    {product.discount}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl md:text-4xl font-bold text-purple-700">&#8377; {product.price}</span>
                                        )}
                                    </div>
                                    {product.inStock !== undefined && (
                                        product.inStock
                                            ? <span className="text-green-600 font-semibold mb-4">In Stock</span>
                                            : <span className="text-red-500 font-semibold mb-4">Out of Stock</span>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <button onClick={() => handleAddToCart(product)} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg px-2 py-3 text-white text-lg font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition">
                                            Add to Cart
                                        </button>
                                        <button onClick={() => handleAddOrder(product)} className="flex-1 bg-yellow-400 rounded-lg px-2 py-3 text-purple-900 text-lg font-semibold shadow hover:bg-yellow-300 transition">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-center text-lg text-gray-500'>Product not available</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductDetail