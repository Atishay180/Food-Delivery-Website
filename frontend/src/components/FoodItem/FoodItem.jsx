import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import Loader from '../Loader/Loader';

const FoodItem = ({ image, name, price, desc, id }) => {
    // const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency, loader } = useContext(StoreContext);

    // State to track if full description is shown
    const [isFullDescShown, setIsFullDescShown] = useState(false);

    // Function to toggle description
    const toggleDescription = () => {
        setIsFullDescShown(!isFullDescShown);
    };

    if(loader){
        return <Loader />
    }

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <span className='food-item-img-span'>
                    <img className='food-item-img' src={image} alt="" />
                </span>
                {!cartItems[id]
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                    : <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
                    </div>
                }
            </div>

            {/* food item text */}
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className={`food-item-desc ${isFullDescShown ? 'expanded' : 'collapsed'}`}>
                    {desc}
                </p>
                <button onClick={toggleDescription} className="toggle-desc-button">
                    {isFullDescShown ? 'See Less' : 'See More'}
                </button>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

export default FoodItem
