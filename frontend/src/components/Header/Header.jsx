import React from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'


const Header = () => {
    const { setMenu } = useContext(StoreContext)
    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <NavLink className="button" to="/menu" onClick={() => setMenu('menu')}> View Menu</NavLink>
            </div>
        </div>
    )
}

export default Header
