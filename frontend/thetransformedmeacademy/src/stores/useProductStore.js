import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
createProduct: async (productData) => {
    set({ loading: true });
    try {
        const res = await axios.post("/products", productData);
        
        set((state) => {
            // Ensure products is always an array
            const currentProducts = Array.isArray(state.products) ? state.products : [];
            return {
                products: [...currentProducts, res.data],
                loading: false,
            };
        });
        
        toast.success("Product created successfully!");
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to create product");
        set({ loading: false });
        throw error;
    }
},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
    set({ loading: true });
    try {
        await axios.delete(`/products/${productId}`);
        set((state) => {
            const currentProducts = Array.isArray(state.products) ? state.products : [];
            return {
                products: currentProducts.filter((product) => product._id !== productId),
                loading: false,
            };
        });
        toast.success("Product deleted successfully!");
    } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.error || "Failed to delete product");
    }
},
	toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
        const response = await axios.patch(`/products/${productId}`);
        set((state) => {
            const currentProducts = Array.isArray(state.products) ? state.products : [];
            return {
                products: currentProducts.map((product) =>
                    product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false,
            };
        });
        toast.success("Product updated successfully!");
    } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.error || "Failed to update product");
    }
},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));