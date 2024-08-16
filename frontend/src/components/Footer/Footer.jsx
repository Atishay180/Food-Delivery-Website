import React, { useContext } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { NavLink } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext'

const Footer = () => {
    const { setMenu } = useContext(StoreContext)

    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><NavLink onClick={() => setMenu("home")} to="/">Home</NavLink></li>
                        <li><NavLink onClick={() => setMenu("about")} to="about">About Us</NavLink></li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>9893312749</li>
                        <li>contact@tomato.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright <span>{new Date(Date.now()).getFullYear()}</span> © Tomato.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
