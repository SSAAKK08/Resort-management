
'use client';

import { useState } from "react";
import { foodData } from "../data/foodData";

const FoodDetail = () => {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(foodData.reservation.defaultGuests);
  const [time, setTime] = useState(foodData.reservation.defaultTime);

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10 font-sans">
      {/* Left Side: Dish Details */}
      <div>
        {/* Image */}
        <img src={foodData.image} alt={foodData.name} className="w-full h-64 object-cover rounded mb-6 shadow" />

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">{foodData.name}</h1>
        <p className="italic text-gray-600 mb-6">{foodData.tagline}</p>

        {/* Story */}
        <h2 className="text-xl font-semibold mb-2">The Story Behind the Dish</h2>
        <p className="text-gray-700 mb-6">{foodData.story}</p>

        {/* Elements */}
        <h2 className="text-xl font-semibold mb-2">Key Ingredients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {foodData.elements.map((item, index) => (
            <div key={index} className="border p-4 rounded shadow-sm">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Wine */}
        <h2 className="text-xl font-semibold mb-2">Sommelier’s Recommendation</h2>
        <p className="mb-6">
            <strong>{foodData.wine.name}</strong> – {foodData.wine.description}
        </p>

        {/* Nutrition */}
        <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
            <ul className="list-disc list-inside mb-6">
                <li>Calories: {foodData.nutrition.calories}</li>
                <li>Protein: {foodData.nutrition.protein}</li>
                <li>Carbs: {foodData.nutrition.carbs}</li>
            </ul>
        </div>

      {/* Right Side: Reservation Form */}
      <div className="border p-6 rounded shadow-lg bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">AZUREA EPICUREAN</h2>
        <p className="mb-4 text-gray-600">Reserve Your Table</p>

        {/* Date */}
        <label className="block mb-2 font-medium">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}  className="w-full border rounded p-2 mb-4" />

        {/* Guests */}
        <label className="block mb-2 font-medium">Guests</label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        {/* Time */}
        <label className="block mb-2 font-medium">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border rounded p-2 mb-6"
        />

        {/* Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Book Experience
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Subject to availability. Cancellation policy applies.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Members enjoy <span className="font-bold">15% off dining</span>.{" "}
          <a href="#" className="text-blue-600 underline">
            Sign in to Azurea Rewards
          </a>
        </p>
      </div>
    </div>
  );
};

export default FoodDetail;
