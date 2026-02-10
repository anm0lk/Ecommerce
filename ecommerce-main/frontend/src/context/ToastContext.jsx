import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-8 sm:top-8 sm:bottom-auto w-[90vw] max-w-xs px-4`}>
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white font-semibold
                        ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-green-400" : ""}
                        ${toast.type === "error" ? "bg-gradient-to-r from-red-500 to-pink-500" : ""}`}>
                        {toast.type === "success" && <span>✅</span>}
                        {toast.type === "error" && <span>❌</span>}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    )
}