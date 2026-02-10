import React, { useContext, useState, useEffect } from 'react'
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import { usePostReq } from '../../hooks/useHttp';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../Loader/Loader';
import { useToast } from '../../context/ToastContext';

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { role, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shippingAddress: '',
    paymentDetails: ''
  });

  useEffect(() => {
    if (role) {
      const timer = setTimeout(() => navigate('/user', { replace: true }), 1800);
      return () => clearTimeout(timer);
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  };
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { confirmPassword, ...filteredFormData } = formData;
      const response = await usePostReq("api/user/register", filteredFormData);

      if (response.error || response.message) {
        throw new Error(response.error || response.message);
      }

      dispatch({
        type: 'LOGIN',
        payload: {
          user: response.user,
          token: response.token,
          role: response.role,
        }
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("role", response.role);
      showToast("Registration successfull!", "success");
      navigate('/');
    } catch (e) {
      setError(e.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100'>
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
        {loading && <Loader text="Signing up..." />}
        <div className={loading ? 'opacity-40 pointer-events-none' : ''}>
          {role ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-3">
                <span className="text-white text-3xl font-bold">😊</span>
              </div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">You're already logged in!</h2>
              <p className="text-gray-500 mb-4 text-center">Redirecting to your profile...</p>
              <Link
                to="/user"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:from-purple-500 hover:to-pink-400 transition"
              >
                Go to Profile
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg mb-2">
                  <span className="text-white text-3xl font-bold">📝</span>
                </div>
                <h2 className='text-3xl md:text-4xl font-bold text-purple-700 mb-2'>Sign Up</h2>
                <p className="text-gray-400 text-sm">{step === 1 ? "Create your account" : "Add your address & payment"}</p>
              </div>
              {error && (
                <div className="mb-4 text-center text-red-500 font-semibold">{error}</div>
              )}
              {step === 1 && (
                <Step1Form
                  formData={formData}
                  handleChange={handleChange}
                  nextStep={nextStep}
                  handleSubmit={handleSubmit}
                />
              )}
              {step === 2 && (
                <Step2Form
                  formData={formData}
                  handleChange={handleChange}
                  prevStep={prevStep}
                  handleSubmit={handleSubmit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup