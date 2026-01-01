// useUserStore.js
import {create} from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async (name, email, password, confirmPassword) => {
       set({loading: true});
       if (password !== confirmPassword){
        toast.error("Passwords do not match");
        set({loading: false});
        return;
       }

       try {
        const res = await axiosInstance.post("/auth/signup", {
            name,
            email,
            password,
        });
        console.log("Signup response:", res.data); // DEBUG
        set({user: res.data.user, loading: false});

    }catch (error) {
        set({loading: false});
        toast.error(error.response?.data?.message || "Something went wrong");
    }
    },

    login: async (email, password) => {
       set({loading: true});
      
       try {
        const res = await axiosInstance.post("/auth/login", {
            email,
            password,
        });
        console.log("Login response:", res.data); // DEBUG
        set({user: res.data.user, loading: false});

    }catch (error) {
        set({loading: false});
        toast.error(error.response?.data?.message || "Something went wrong");
    }
    },

    logout: async () => {
        try {
           const res = await axiosInstance.post("/auth/logout");
            set({user: null, });
        }   
        catch (error) {
            set({loading: false});
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    checkAuth: async () => {
        set({checkingAuth: true});
        try {
            const response = await axiosInstance.get("/auth/profile");
            console.log("CheckAuth response:", response.data); // DEBUG
            set({user: response.data, checkingAuth: false});
        } catch (error) {
            console.log("CheckAuth error:", error); // DEBUG
            set({user: null, checkingAuth: false});
        }       
    }
}));
// Axios interceptor to handle token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		const originalRequest = error.config;
// 		if (error.response?.status === 401 && !originalRequest._retry) {
// 			originalRequest._retry = true;

// 			try {
// 				// If a refresh is already in progress, wait for it to complete
// 				if (refreshPromise) {
// 					await refreshPromise;
// 					return axios(originalRequest);
// 				}

// 				// Start a new refresh process
// 				refreshPromise = useUserStore.getState().refreshToken();
// 				await refreshPromise;
// 				refreshPromise = null;

// 				return axios(originalRequest);
// 			} catch (refreshError) {
// 				// If refresh fails, redirect to login or handle as needed
// 				useUserStore.getState().logout();
// 				return Promise.reject(refreshError);
// 			}
// 		}
// 		return Promise.reject(error);
// 	}
// );
