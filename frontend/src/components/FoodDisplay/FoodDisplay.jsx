// import React from 'react'
import { useContext } from "react"
import "./FoodDisplay.css"
import PropTypes from 'prop-types';
import { StoreContext } from "../../context/StoreContext"
import FoodItem from "../FoodItem/FoodItem"
const FoodDisplay = ({ category, setShowAddItem }) => {
    const { food_list, user, searchQuery } = useContext(StoreContext)
  return (
    <div className="food-display" id="food-display">
        <div className="food-display-header">
            <h2>Top dishes near you</h2>
            {user?.role === "admin" && (
                <button className="add-item-trigger-btn" onClick={() => setShowAddItem(true)}>
                    <span>+</span> Add Food Item
                </button>
            )}
        </div>
        <div className="food-display-list">
            {
                food_list.filter((item) => {
                    if (searchQuery) {
                        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               item.description.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                }).map((item,index)=>{
                    if(category === "All" || category === item.category){
                    return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
                    }
                })
            }
        </div>
    </div>
  )
}


FoodDisplay.propTypes = {
        category: PropTypes.string.isRequired,
        setShowAddItem: PropTypes.func.isRequired
}

export default FoodDisplay