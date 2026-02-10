import './App.css'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { Route, Routes } from 'react-router-dom'
import ProductList from './components/Product/ProductList'
import ProductDetail from './components/Product/ProductDetail'
import Cart from './components/Cart/Cart'
import Profile from './components/Profile/Profile'
import Order from './components/Order/Order'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import ProductEdit from './components/Product/ProductEdit'
import CartAdmin from './components/Cart/CartAdmin'
import OrderAdmin from './components/Order/OrderAdmin'
import ProfileUsers from './components/Profile/ProfileUsers'
import ProfileAdmins from './components/Profile/ProfileAdmins'
import Navbar from './components/Navbar/Navbar'
import Checkout from './components/Checkout/Checkout'

function App() {

  const { role } = useContext(AuthContext);
  return (

    <>
      <Navbar />
      <Routes>
        {/* Public Layout */}
        <>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/' element={<ProductList />} />
          <Route path='/product/:productId' element={<ProductDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </>
        {
          role === 'USER' && (
            //  User Private Layout 
            <>
              <Route path='/cart' element={<Cart />} />
              <Route path='/orders' element={<Order />} />
              <Route path='/user' element={<Profile />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path="*" element={<NotFoundPage />} />
            </>)
        }
        {
          role === 'ADMIN' && (
            <>
              <Route path='/' element={<ProductList />} />
              <Route path='/user' element={<Profile />} />
              <Route path='/users' element={<ProfileUsers />} />
              <Route path='/admins' element={<ProfileAdmins />} />
              <Route path='/cart' element={<CartAdmin />} />
              <Route path='/orders' element={<OrderAdmin />} />
              <Route path='/product' element={<ProductEdit />} />
              <Route path='/update/product/:productId' element={<ProductEdit />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )
        }

      </Routes>
    </>
  )
}

export default App
