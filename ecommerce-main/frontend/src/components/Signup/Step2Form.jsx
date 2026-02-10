import React from 'react'

const Step2Form = ({ formData, handleChange, prevStep, handleSubmit }) => {
    return (
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor='shippingAddress' className='text-gray-600 font-semibold'>Shipping Address</label>
                <input type='text' name='shippingAddress' placeholder='Shipping Address' value={formData.shippingAddress} onChange={handleChange}
                    className='p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50' required />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor='paymentDetails' className='text-gray-600 font-semibold'>Payment Details</label>
                <input type='text' name='paymentDetails' placeholder='Payment Details' value={formData.paymentDetails} onChange={handleChange}
                    className='p-3 border-b-2 border-purple-200 focus:border-purple-500 rounded outline-none transition bg-gray-50' required />
            </div>
            <div className="flex flex-row gap-4 mt-2">
                <button type="button" onClick={prevStep}
                    className='flex-1 bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 rounded-lg font-semibold py-3 hover:from-gray-400 hover:to-gray-300 transition shadow'>
                    Back
                </button>
                <button type="submit"
                    className='flex-1 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-semibold py-3 hover:from-green-600 hover:to-green-500 transition shadow'>
                    Submit
                </button>
            </div>
        </form>
    )
}

export default Step2Form