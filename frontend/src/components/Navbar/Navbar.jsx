import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'

const Navbar = ({ setShowLogin }) => {

  // const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, menu, setMenu } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token"); 
    setToken("");
    navigate('/');
    toast.success("Logged out successfully");
  }

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>

      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <Link to="/menu" onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>Menu</Link>
        <Link to="/about" onClick={() => setMenu("about")} className={`${menu === "about" ? "active" : ""}`}>About Us</Link>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact Us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />

        {/* cart  */}
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        {/* sign in or login  */}
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> :
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />

            <ul className='navbar-profile-dropdown'>
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
