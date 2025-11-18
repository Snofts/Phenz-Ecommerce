import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = ({deliveryTag}) => {
    const {currency, delivery_fee,getCartAmount, deliveryFee, setDeliveryFee} = useContext(ShopContext)

    const deliveryAmt = () => {
        if(deliveryTag === "hidden"){
            // setDeliveryFee(0)
            return 0;
        } else if(deliveryTag === "visible"){
            // setDeliveryFee(deliveryFee)
            return deliveryFee
        }
    } 

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
        </div>
        <div className='flex flex-col mt-2 gap-2 text-xs'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />
            <div className={`flex justify-between`}>
                <p>Shipping Fee</p>
                <p>{currency} {deliveryAmt()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{getCartAmount() === 0 ? 0 : getCartAmount() + deliveryAmt()}.00</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal