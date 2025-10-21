import { createContext, useEffect, useState } from "react";
// import { ShopContext } from './ShopContext';
import { products } from "../assets/assets";
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₦'
    const delivery_fee = 10;

    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const navigate = useNavigate()

    const addToCart = async (itemId, size) => {
        if(!size) {
            toast.error('Select product size')
            return
        }

        let cardData = structuredClone(cartItems)

        if (cardData[itemId]) {
            if(cardData[itemId][size]){
                cardData[itemId][size] += 1
            } else {
                 cardData[itemId][size] = 1
            }
        } else {
            cardData[itemId] = {}
            cardData[itemId][size] = 1
        }

        setCartItems(cardData)
    }

    const getCartCount = ( ) => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if (cartItems[items][item]){
                    totalCount += cartItems[items][item]
                }
                } catch {

                }
        }
        }

        return totalCount;
    }

    const updateQuantity = async (items, size, quantity) => {
        let cartData = structuredClone(cartItems)

        cartData[items][size] = quantity;
        setCartItems(cartData)
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items)
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error){

                }
            }
        }

        return totalAmount;
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch, cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate 
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;