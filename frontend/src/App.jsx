import React, { useContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Navbar from './components/Navbar/Navbar'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Footer from './components/Footer/Footer'
import Menu from './pages/Menu/Menu'
import About from './pages/About/About'
import { StoreContext } from './context/StoreContext'
import './App.css'


const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { serverAwake } = useContext(StoreContext);

  if (!serverAwake) {
    return (
      <div className="server-notice-wrapper">
        <div className="server-notice-box">
          <p className="server-notice-text">
            ⚠️ The backend is hosted on a Render free instance. It may take 30–40 seconds to start.
            <br />
            Please be patient while it loads...
          </p>
          <p className="server-note">
            🔁 <strong>Note:</strong> If the backend still doesn't load, kindly refresh the page.
          </p>
          <p className="server-warning">
            🚫 This application is made just to demonstrate skills and for testing purposes only.
            Please do not misuse it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<About />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
