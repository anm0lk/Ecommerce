import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetReq, usePostReq, usePutReq, useDeleteReq } from '../../hooks/useHttp';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductEdit = () => {
    const { productId } = useParams();
    const {showToast}=useToast();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: '',
        category: "",
        imageUrl: ""
    });

    const fetchProductDetails = async () => {
        const data = await useGetReq(`api/products/get/${productId}`, token);
        setForm(data);
    }

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (productId) {
            await usePutReq('api/products/update', form, token);
            showToast("Product updated successfully","success");
        } else {
            await usePostReq('api/products/add', form, token);
            showToast("Product added successfully","success");
        }
        navigate('/');
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        await useDeleteReq(`api/products/${productId}`, token);
        navigate('/');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
                    {productId ? 'Edit Product' : 'Add Product'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-1">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                        />
                        {form.imageUrl && (
                            <img src={form.imageUrl} alt="Preview" className="mt-2 h-32 w-32 object-contain border rounded-lg shadow" />
                        )}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition"
                            required
                            min="0"
                        />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg shadow hover:from-purple-500 hover:to-pink-400 transition"
                        >
                            {productId ? 'Update Product' : 'Add Product'}
                        </button>
                        {productId && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow hover:from-red-400 hover:to-pink-400 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEdit