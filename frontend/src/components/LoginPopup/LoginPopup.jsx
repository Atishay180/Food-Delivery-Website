import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from "react-toastify"

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url, loadCartData, loader, setLoader } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        setLoader(true)
        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData({ token: response.data.token })
                setShowLogin(false)

                toast.success(response.data.message || "Login successful")
            }
            else {
                toast.error(response.data.message || "Error while login")
            }
        } catch (error) {
            toast.error(error.message || "Error while login")
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>

                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}

                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email} type="email"
                        placeholder={`${currState === 'Sign Up' ? 'Enter Email' : 'Enter "test3@gmail.com" as Email'}`}
                        required
                    />

                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password} type="password"
                        placeholder={`${currState === 'Sign Up' ? 'Enter Password' : 'Enter "Test1234" as Password'}`}
                        required
                    />
                </div>

                {loader ?
                    <button>Loading...</button>
                    :
                    <button>{currState === "Login" ? "Login" : "Create account"}</button>
                }

                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, i agree to the terms of use & <span>privacy policy</span>.</p>
                </div>

                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
