import React, { useContext, useState } from 'react'
import './Menu.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'



const Menu = () => {
    const { food_list, cartItems, addToCart, removeFromCart, url, currency, menu_list } = useContext(StoreContext);

    //sort functionality
    const [category, setCategory] = useState("All")
    const handleSortButton = (e) => {
        e.preventDefault();

        setCategory(e.target.value);
    }
    const filteredFoodList = category === "All"
        ? food_list
        : food_list.filter(item => item.category === category);

    // State to track if full description is shown
    const [isFullDescShown, setIsFullDescShown] = useState(false);

    //toggle description
    const toggleDescription = () => {
        setIsFullDescShown(!isFullDescShown);
    };


    return (
        <div className='food-display' id='food-display'>
            <div className='food-item-header'>
                <h2>Top dishes near you</h2>
                <select onChange={(e) => handleSortButton(e)} value={category} name="" id="">
                    <option value="All">All</option>
                    {menu_list.map((item, index) => (
                        <option key={index} value={item.menu_name}>{item.menu_name}</option>
                    ))}
                </select>
            </div>


            <div className='food-display-list'>
                {filteredFoodList.map((item) => (
                    <div className='food-item' key={item._id}>
                        <div className='food-item-img-container'>
                            <span className='food-item-img-span'>
                                <img className='food-item-img' src={url + "/images/" + item.image} alt="" />
                            </span>
                            {!cartItems[item._id]
                                ? <img className='add' onClick={() => addToCart(item._id)} src={assets.add_icon_white} alt="" />
                                : <div className="food-item-counter">
                                    <img src={assets.remove_icon_red} onClick={() => removeFromCart(item._id)} alt="" />
                                    <p>{cartItems[item._id]}</p>
                                    <img src={assets.add_icon_green} onClick={() => addToCart(item._id)} alt="" />
                                </div>
                            }
                        </div>

                        {/* food item text */}
                        <div className="food-item-info">
                            <div className="food-item-name-rating">
                                <p>{item.name}</p> <img src={assets.rating_starts} alt="" />
                            </div>
                            <p className={`food-item-desc ${isFullDescShown ? 'expanded' : 'collapsed'}`}>
                                {item.description}
                            </p>
                            <button onClick={toggleDescription} className="toggle-desc-button">
                                {isFullDescShown ? 'See Less' : 'See More'}
                            </button>
                            <p className="food-item-price">{currency}{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Menu
