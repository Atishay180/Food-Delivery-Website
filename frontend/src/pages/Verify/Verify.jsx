import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import './Verify.css'
import { toast } from 'react-toastify';

const Verify = () => {
  const { url } = useContext(StoreContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", { success, orderId });
      if (response.data.success) {
        navigate("/myorders");
        toast.success(response.data.message || "Order Placed Successfully")
        setTimeout(() => {
          toast.success("Your food will be delivered soon")
        }, 5000);
      }
      else {
        navigate("/")
        toast.error(response.data.message)
      }
    }

    catch (error) {
      toast.error(error.message || "Error in verifying Payment");
      navigate("/")
    }
  }

  useEffect(() => {
    verifyPayment();
  }, [])

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
