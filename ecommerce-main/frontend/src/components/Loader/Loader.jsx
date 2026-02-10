import React from 'react';

const Loader = ({ text = "Loading..." }) => (
  <div className="absolute inset-0 bg-opacity-70 flex items-center justify-center z-10 rounded-3xl">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-10 w-10 text-purple-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="text-purple-600 font-semibold">{text}</span>
    </div>
  </div>
);

export default Loader;