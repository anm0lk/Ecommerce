const savedUser = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null;
const savedToken = localStorage.getItem("token");
const savedRole = localStorage.getItem("role");
export const initialAuthState = {
    isAuthenticated: !!savedUser,
    user: savedUser || null,
    token: savedToken || null,
    role: savedRole || null,
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            const newState = {
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                role: action.payload.role,
            };
            // console.log(newState);
            return newState;
        case "LOGOUT":
            return {
                isAuthenticated: false,
                user: null,
                token: null,
                role: null,
            };
        default:
            return state;
    }
}