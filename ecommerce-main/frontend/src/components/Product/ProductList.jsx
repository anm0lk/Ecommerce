import React, { useContext, useEffect, useState } from 'react'
import { useDeleteReq, useGetReq, usePostReq } from '../../hooks/useHttp'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { useToast } from '../../context/ToastContext';

const ProductList = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search')?.toLowerCase() || '';
    const { role, user, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const filteredProducts = searchQuery
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            (product.category && product.category.toLowerCase().includes(searchQuery))
        ) : products;

    const fetchAllProducts = async () => {
        try {
            const data = await useGetReq('api/products/get', null);
            setProducts(data);
            return data;
        } catch (e) {
            throw new Error(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, [loading])

    const handleClickUser = (productId) => {
        navigate(`/product/${productId}`);
    }
    const handleClickAdmin = (productId) => {
        navigate(`/update/product/${productId}`);
    }

    const handleAddCart = async (product) => {
        try {
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
            showToast("Product added to cart!", "success");
        } catch (e) {
            showToast("Product could not be added to cart!", "error");
        } finally {
            setLoading(false);
        }
    }
    const handleEditProduct = (product) => {
        navigate(`/update/product/${product.productId}`);
    }
    const handleDeleteProduct = async (product) => {
        await useDeleteReq(`api/products/${product.productId}`, token);
        setLoading(true);
    }

    return (
        <div className='p-4 md:p-8 bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen'>
            <h1 className='text-4xl md:text-4xl font-bold text-center mb-6 text-purple-800'>Our Products</h1>
            {
                user && user.role === 'ADMIN' && (
                    <div className='flex justify-end max-w-5xl mx-auto mb-6'>
                        <button className='bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-purple-500 hover:to-pink-400 transition' onClick={() => navigate('/product')}>+ Add Product</button>
                    </div>
                )
            }
            {
                loading ? (
                    <Loader />
                ) : filteredProducts?.length > 0 ? (
                    <div className='flex flex-wrap justify-center gap-8'>
                        {filteredProducts.map(product =>
                            <div
                                key={product.productId}
                                className='bg-white w-full max-w-xs rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col'
                            >
                                <div
                                    className="relative h-72 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center cursor-pointer group"
                                    onClick={() => {
                                        if (role === 'ADMIN')
                                            handleClickAdmin(product.productId)
                                        else
                                            handleClickUser(product.productId)
                                    }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className='object-contain h-64 w-full transition-transform duration-300 group-hover:scale-110 drop-shadow-xl rounded-2xl'
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h2
                                        className='text-lg font-bold text-purple-800 mb-2 cursor-pointer truncate'
                                        title={product.name}
                                        onClick={() => handleClick(product.productId)}
                                    >
                                        {product.name}
                                    </h2>
                                    <p
                                        className='text-base text-gray-500 mb-2 line-clamp-2 min-h-[2.5em]'
                                        title={product.description}
                                    >
                                        {product.description}
                                    </p>
                                    <div className='flex items-center justify-between mt-auto mb-4'>
                                        <span className='text-xl font-bold text-purple-600'>&#8377; {product.price}</span>
                                        {product.category && (
                                            <span className='bg-purple-50 text-purple-500 text-xs px-2 py-1 rounded-full font-semibold'>{product.category}</span>
                                        )}
                                    </div>
                                    <div className='flex gap-2'>
                                        {user && user.role === 'USER' && (
                                            <button
                                                className='flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition'
                                                onClick={() => handleAddCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                        {user && user.role === 'ADMIN' && (
                                            <>
                                                <button
                                                    className='flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition'
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition'
                                                    onClick={() => handleDeleteProduct(product)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className='text-center text-lg text-gray-500'>No Products</p>
                )
            }
        </div>
    )
}

export default ProductList