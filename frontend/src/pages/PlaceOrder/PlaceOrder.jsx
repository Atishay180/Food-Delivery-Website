import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

const PlaceOrder = () => {

  const [payment, setPayment] = useState("")
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "Madhya Pradesh",
    zipcode: "",
    country: "India",
    phone: ""
  })

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
    deliveryCharge,
    loader,
    setLoader
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (e) => {
    e.preventDefault()

    if (data.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    let orderItems = [];

    food_list.map(((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    }))

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryCharge,
    }

    if (payment === "stripe") {
      // setLoader(true);
      // let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      // setLoader(false)
      // if (response.data.success) {
      //   const { session_url } = response.data;
      //   window.location.replace(session_url);
      // }
      // else {
      //   toast.error("Something Went Wrong")
      // }
      toast.error("Sorry currently we are accepting only cash on delivery")
      return;
    }

    else {
      if (window.confirm("Are you sure want to place order via cash on delivery")) {
        setLoader(true)
        let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
        setLoader(false)
        if (response.data.success) {
          navigate("/myorders")
          toast.success(response.data.message)
          setCartItems({});
        }
        else {
          toast.error("Something Went Wrong")
        }
      }
    }
  }

  useEffect(() => {
    if (!token) {
      toast.error("To place an order sign in first")
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  if (loader) {
    return <Loader />
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>

        <div className="multi-field">
          <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
          <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
        </div>
        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
        <div className="multi-field">
          <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
          <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' disabled />
        </div>
        <div className="multi-field">
          <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
          <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' disabled />
        </div>
        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
          </div>
        </div>
        <div className="payment">
          <h2>Payment Method</h2>
          <div onClick={() => setPayment("cod")} className={`payment-option ${payment === "cod" ? "payment-btn-color" : ""}`}>
            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
            <p>COD ( Cash on delivery )</p>
          </div>
          <div onClick={() => setPayment("stripe")} className={`payment-option ${payment === "stripe" ? "payment-btn-color" : ""}`}>
            <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
            <p>Stripe ( Credit / Debit )</p>
          </div>
        </div>
        <button className={`place-order-submit ${payment === "" ? "place-order-btn " : ""}`} type='submit'>{payment === "cod" ? "Place Order Via COD" : "Proceed To Payment"}</button>
      </div>
    </form>
  )
}

export default PlaceOrder
