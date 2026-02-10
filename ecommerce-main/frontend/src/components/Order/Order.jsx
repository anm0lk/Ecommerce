import React, { useContext, useEffect, useState } from 'react'
import { useGetReq } from '../../hooks/useHttp';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

const Order = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const data = await useGetReq(`api/orders/${user.userId}`, token);
      // console.log(data);
      setOrders(data.reverse());
    } catch (e) {
      throw new Error(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUserOrders();
  }, [])
  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-100 p-6 min-h-screen">
      {loading ?
        <Loader text='Loading...' /> : <div>
          {orders && orders.length > 0 ?
            <div>
              <h1 className='text-4xl text-center font-bold text-purple-800 mb-6'>Your Orders</h1>
              <div className="space-y-10 max-w-5xl mx-auto">
                {orders.map(order => (
                  <div key={order.orderId} className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between md:items-center text-sm">
                      <div>
                        <p className='text-gray-700 font-semibold'>Order Date: <span className='text-gray-500'>{order.orderDate}</span></p>
                        <p className='text-gray-700 font-semibold'>Shipping Address: <span className='text-gray-500'>{order.shippingAddress}</span></p>
                      </div>
                      <div className="flex mt-4 md:mt-0 gap-4">
                        <span className={`rounded-full px-3 py-1 font-semibold ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.orderStatus}</span>
                        <span className={`rounded-full px-3 py-1 font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.paymentStatus}</span>
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
                          {order.orderItems.map((oi, idx) => (
                            <tr key={oi.orderItemId} className={`transition ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50`}>
                              <td className='px-4 py-3 font-medium text-gray-800'>
                                <span className='block'>{oi.productName}</span>
                                {oi.productBrand && (
                                  <span className='text-xs text-gray-400'>{oi.productBrand}</span>
                                )}
                              </td>
                              <td className='px-2 py-3 overflow-hidden'><img src={oi.productImageUrl} className='h-20 w-20 object-contain border shadow-sm bg-white rounded-xl' /></td>
                              <td className='px-4 py-3 text-gray-700 whitespace-nowrap'>&#8377; {oi.productPrice}</td>
                              <td className='px-4 py-3 text-gray-700 '>{oi.quantity}</td>
                              <td className='px-4 py-3 text-purple-700 font-semibold whitespace-nowrap'>&#8377; {oi.totalPrice}</td>
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
            </div> : <p>No order</p>
          }
        </div>
      }
    </div>
  )
}

export default Order
