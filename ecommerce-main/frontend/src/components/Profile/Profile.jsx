import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useGetReq, usePutReq } from '../../hooks/useHttp';
import Loader from '../Loader/Loader';

const Profile = () => {
  const { user, role, token, dispatch } = useContext(AuthContext);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [pass, setPass] = useState({
    password: '',
    confpass: ''
  });
  const [userData, setUserData] = useState();
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    paymentDetails: false,
    shippingAddress: false,
    password: false
  });
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const data = await useGetReq(`api/user/${user.userId}`, token);
      // console.log(data);
      setUserData(data);
      setFormData(data);
    } catch (e) {
      throw new Error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && user.userId) {
      fetchUserDetails();
    }
  }, [reload, user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const changesMade = Object.keys(formData).reduce((acc, key) => {
        if (key === 'userId') {
          acc['id'] = formData[key];
        }
        if (formData[key] !== userData[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});
      // console.log(changesMade)
      const updatedUser = await usePutReq('api/user/update-user', changesMade, token);
      // console.log(updatedUser)
      dispatch({
        type: 'LOGIN',
        payload: {
          user: updatedUser.user,
          token: updatedUser.token,
          role: user.role,
        }
      })
      setEditMode({
        name: false,
        email: false,
        paymentDetails: false,
        shippingAddress: false,
        password: false
      });
      setReload(r => !r);
    } catch (e) {
      throw new Error(e);
    }
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const isValidEdit = () => {
    if (!formData || !userData) return false;
    return Object.keys(formData).some(
      key => formData[key] !== userData[key]
    )
  }
  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen'>
      {loading && <Loader />}
      {userData &&
        <form onSubmit={(e) => handleSubmit(e)} className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg'>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-2">
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-2'>
              <span className='text-white text-4xl font-bold'>{userData.name ? userData.name[0].toUpperCase() : 'U'}</span>
            </div>
            <h2 className='text-purple-700 font-bold text-2xl mt-2'>{userData.name}</h2>
            <p className='text-gray-400 text-sm'>Account Settings</p>
          </div>
          <hr className="my-2 border-purple-100" />
          {/* Form */}
          <div className="flex items-center justify-between  mt-4 gap-2">
            <label htmlFor='name' className='w-32 text-gray-600 font-semibold'>Name:</label>
            {
              editMode.name ? (
                <input value={formData.name} name='name' onChange={e => handleChange(e)} className='border-b-2 border-purple-300 focus:border-purple-600 outline-none w-full flex-1 transition px-2 py-1' autoFocus />
              ) : (<span className='flex-1'>{formData.name}</span>)
            }
            <button type='button' title='Edit Name' className='ml-2 text-purple-400 hover:text-purple-700 transition' tabIndex={-1} onClick={() => setEditMode({ ...editMode, name: !editMode.name })}>
              {
                editMode.name ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {/* Pencil */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" />
                    {/* Slash from top-left to bottom-right */}
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" /></svg>
                )
              }
            </button>
          </div>
          <div className="flex justify-between items-center  mt-4 gap-2">
            <label htmlFor='email' className='w-32 text-gray-600 font-semibold'>Email:</label>
            {
              formData.email && (
                <span name='email' className='flex-1'>{formData.email}</span>
              )
            }
            <button type='button' title='Edit Email' className='ml-2 text-purple-400 hover:text-purple-700 transition' tabIndex={-1}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {/* Pencil */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" />
                {/* Slash from top-left to bottom-right */}
                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {role==='USER'&&<div className="flex justify-between items-center  mt-4 gap-2">
            <label htmlFor='paymentDetails' className='w-32 text-gray-600 font-semibold'>Payment:</label>
            {
              editMode.paymentDetails ? (
                <input value={formData.paymentDetails} name='paymentDetails' onChange={e => handleChange(e)} className='border-b-2 border-purple-300 focus:border-purple-600 outline-none flex-1 transition px-2 py-1' autoFocus />
              ) : (
                <span className='flex-1'>{formData.paymentDetails}</span>
              )
            }
            {<button type='button' title='Edit Payment' className='ml-2 text-purple-400 hover:text-purple-700 transition' tabIndex={-1} onClick={() => setEditMode({ ...editMode, paymentDetails: !editMode.paymentDetails })}>
              {
                editMode.paymentDetails ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {/* Pencil */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" />
                    {/* Slash from top-left to bottom-right */}
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" /></svg>
                )
              }
            </button>
            }
          </div>}
          {role==='USER'&&<div className="flex items-center justify-between  mt-4 gap-2">
            <label htmlFor='shippingAddress' className='w-32 text-gray-600 font-semibold'>Address:</label>
            {
              editMode.shippingAddress ? (
                <input value={formData.shippingAddress} name='shippingAddress' onChange={e => handleChange(e)} className='border-b-2 border-purple-300 focus:border-purple-600 outline-none transition flex-1 px-2 py-1' autoFocus />
              ) : (
                <span className='flex-1'>{formData.shippingAddress}</span>
              )
            }
            <button type='button' title='Edit Shipping' className='ml-2 text-purple-400 hover:text-purple-700 transition' tabIndex={-1} onClick={() => setEditMode({ ...editMode, shippingAddress: !editMode.shippingAddress })}>
              {
                editMode.shippingAddress ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {/* Pencil */}
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" />
                    {/* Slash from top-left to bottom-right */}
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z" /></svg>
                )
              }
            </button>
          </div>}
          <hr className="my-2 mt-4 border-purple-100" />
          {/* Update Password */}
          <div>
            <button type='button' className='underline text-purple-600 font-semibold hover:text-purple-800' onClick={() => setChangePassword(!changePassword)}>{!changePassword ? 'Change Password' : 'Cancel Password Change'}</button>
            {changePassword &&
              <div className='mt-4 space-y-2'>
                <div className="flex flex-col">
                  <label htmlFor="password" className='text-sm text-gray-600 mb-1'>New Password</label>
                  <input type="text" name="password" value={pass.password} onChange={e => setPass({ ...pass, password: e.target.value })} className='border-b-2 border-purple-300 focus:border-purple-600 outline-none px-2 py-1 w-full transition' />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="confirm" className='text-sm text-gray-500'>Confirm Password</label>
                  <input type="password" name="confirm" value={pass.confpass} onChange={e => setPass({ ...pass, confpass: e.target.value })} className='border-b-2 border-purple-300 focus:border-purple-600 outline-none px-2 py-1 w-full transition' />
                </div>
                {pass.password === pass.confpass && pass.password !== '' && <button type='button' className='mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-500 hover:to-pink-400 transition' onClick={() => { setFormData({ ...formData, password: pass.password }); setChangePassword(false); setPass({ password: '', confpass: '' }); }}>Update Password</button>}
                {pass.password && pass.password !== pass.confpass && pass.password !== '' && (
                  <p className='text-red-500 text-sm'>Passwords do not match.</p>
                )}
              </div>
            }
          </div>
          {isValidEdit() && <button type='submit' className='w-full mt-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-white rounded-lg shadow hover:from-purple-500 hover:to-pink-400 transition'>Save Changes</button>}
        </form>
      }
    </div >
  )
}

export default Profile
