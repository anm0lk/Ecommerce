import React from 'react'

const Step1Form = ({ formData, handleChange, nextStep, handleSubmit }) => {

    const isValidEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(formData.email);
    }
    const checkPassword = () => {
        return formData.password === formData.confirmPassword && formData.password !== '';
    }
    const checkDetails = () => {
        return formData.name !== '' && formData.email !== '' && checkPassword()
    }
    let role = 'USER'
    return (
        <form className='flex flex-col gap-6' onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col gap-2">
                <label htmlFor='name' className='text-gray-600 font-semibold'>Name</label>
                <input type='text' id='name' name='name' placeholder='Name' value={formData.name} onChange={handleChange}
                    className='p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50' required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor='email' className='text-gray-600 font-semibold'>Email</label>
                <input type='email' id='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange}
                    className={`p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50 ${!isValidEmail() && formData.email ? 'border-red-500' : ''}`} required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor='password' className='text-gray-600 font-semibold'>Password</label>
                <input type='password' id='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange}
                    className='p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50' required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor='confpass' className='text-gray-600 font-semibold'>Confirm Password</label>
                <input type='password' id='confpass' name='confirmPassword' placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleChange}
                    className='p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50' required />
            </div>

            {!checkPassword() && formData.confirmPassword && (<p className='text-red-500 text-sm'>Passwords do not match</p>)}
            {role === 'USER' && <button
                type="button"
                onClick={nextStep}
                disabled={!checkDetails()}
                className={`rounded-lg font-semibold py-3 mt-2 transition ${checkDetails() ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400 cursor-pointer shadow' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Next
            </button>}
            {role === 'ADMIN' && <button
                type="submit"
                onClick={handleSubmit}
                disabled={!checkDetails()}
                className={`rounded-lg font-semibold py-3 mt-2 transition ${checkDetails() ? 'bg-gradient-to-r from-green-500 to-green-400 text-white hover:from-green-600 hover:to-green-500 cursor-pointer shadow' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Submit
            </button>}
        </form>
    )
}

export default Step1Form