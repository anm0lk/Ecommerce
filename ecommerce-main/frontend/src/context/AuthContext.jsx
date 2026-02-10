import { createContext, useReducer } from "react";
import { authReducer, initialAuthState } from "./AuthReducer";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, initialAuthState);
    const logout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    }
    return (
        <AuthContext.Provider value={{ ...authState, dispatch, logout }}>
            {children}
        </AuthContext.Provider>
    )
}