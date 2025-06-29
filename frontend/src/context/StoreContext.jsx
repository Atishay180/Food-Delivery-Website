import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);
import { toast } from "react-toastify"

const StoreContextProvider = (props) => {

    // const url = import.meta.env.VITE_API_URL || "http://localhost:4000"
    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [loader, setLoader] = useState(false);
    const [serverAwake, setServerAwake] = useState(false);
    const [menu, setMenu] = useState("home");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (cartItems[itemId] >= 8) {
            toast.info("You can't add more than 8 of the same item to the cart");
            return;
        }
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            setLoader(true)
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                toast.error(error.response.data.success || "Cannot remove the items from cart")
            } finally {
                setLoader(false)
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {
                toast.error(error.response.data.success || "Error in fetching cart")
            }

        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        setLoader(true);
        try {
            const { data } = await axios.get(url + "/api/food/list");
            setFoodList(data.data)
            setServerAwake(true);
        } catch (error) {
            console.error("Failed to fetch food list", error.message);
            toast.error(error.response?.data?.message || error.message || "Something Went Wrong")
            setServerAwake(false);
        } finally {
            setLoader(false);
        }
    }

    const loadCartData = async (token) => {
        setLoader(true);
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
        setLoader(false)
    }

    useEffect(() => {
        async function loadData() {
            setLoader(true)
            await fetchFoodList();
            setLoader(false)

            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))

                setLoader(true);
                await loadCartData({ token: localStorage.getItem("token") })
                setLoader(false);
            }
        }

        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        loader,
        setLoader,
        menu,
        setMenu,
        serverAwake
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;