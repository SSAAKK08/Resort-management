import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../hearder&footer/Navbar";
import Footer from "../hearder&footer/Footer";

import { cardData } from "../data/dataBooking";

import {
    FaStar,
    FaBed,
    FaUsers,
    FaSwimmingPool,
    FaCheck,
    FaArrowLeft,
} from "react-icons/fa";

import { MdOutlineCropSquare } from "react-icons/md";

function DetailRoom() {
    const { id } = useParams();
    const navigate = useNavigate();

    const room = cardData.find(
        (roomItem) => roomItem.id === Number(id)
    );

    const [bookingData, setBookingData] = useState({
        checkIn: "",
        checkOut: "",
        guests: "2 Adults",
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setBookingData({
            ...bookingData,
            [name]: value,
        });
    }

    function handleBooking() {
        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        if (!loggedInUser) {
            alert("Please login first before booking a room.");
            navigate("/login");
            return;
        }

        if (!bookingData.checkIn || !bookingData.checkOut) {
            alert("Please select the check-in and check-out dates.");
            return;
        }

        const bookings =
            JSON.parse(localStorage.getItem("roomBookings")) || [];

        const newBooking = {
            id: Date.now(),
            roomId: room.id,
            roomTitle: room.title,
            roomImage: room.image,
            price: room.price,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: bookingData.guests,
            userEmail: loggedInUser.email,
        };

        localStorage.setItem(
            "roomBookings",
            JSON.stringify([...bookings, newBooking])
        );

        alert(`${room.title} booked successfully.`);
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="min-h-[70vh] flex flex-col items-center justify-center px-5">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Room not found
                    </h1>

                    <p className="text-gray-500 mt-3">
                        The room you requested does not exist.
                    </p>

                    <Link
                        to="/booking"
                        className="mt-6 bg-primary-Blue text-white px-6 py-3 rounded-xl"
                    >
                        Return to Rooms
                    </Link>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f9fd]">
            <Navbar />

            <main className="lg:px-16 md:px-8 px-4 lg:pt-32 pt-24 pb-20">

                {/* Back button */}
                <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 text-primary-Blue font-semibold mb-6"
                >
                    <FaArrowLeft />
                    Back to all rooms
                </Link>

                {/* Room image gallery */}
                <section className="grid grid-cols-12 gap-4">
                    <div className="lg:col-span-8 col-span-12">
                        <img
                            src={room.gallery[0]}
                            alt={room.title}
                            className="w-full lg:h-[550px] md:h-[430px] h-[300px] object-cover rounded-2xl"
                        />
                    </div>

                    <div className="lg:col-span-4 col-span-12 grid lg:grid-rows-2 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        <img
                            src={room.gallery[1]}
                            alt={`${room.title} view`}
                            className="w-full lg:h-full md:h-[230px] h-[200px] object-cover rounded-2xl"
                        />

                        <img
                            src={room.gallery[2]}
                            alt={`${room.title} interior`}
                            className="w-full lg:h-full md:h-[230px] h-[200px] object-cover rounded-2xl"
                        />
                    </div>
                </section>

                {/* Room information and booking card */}
                <section className="grid grid-cols-12 lg:gap-12 gap-8 mt-10">

                    {/* Left side */}
                    <div className="lg:col-span-8 col-span-12">

                        <p className="text-sm uppercase tracking-[0.2em] text-primary-Blue font-bold">
                            Premium Experience
                        </p>

                        <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold text-gray-900 mt-3">
                            {room.title}
                        </h1>

                        {/* Short details */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-600 mt-6 pb-7 border-b border-gray-300">

                            <div className="flex items-center gap-2">
                                <MdOutlineCropSquare />
                                <span>{room.size}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaBed />
                                <span>{room.bed}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaUsers />
                                <span>{room.guests}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaSwimmingPool />
                                <span>{room.view}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-8 mt-7 text-base md:text-lg">
                            {room.description}
                        </p>

                        {/* Amenities */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Premium Amenities
                            </h2>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
                                {room.amenities.map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-10 h-10 rounded-full bg-blue-100 text-primary-Blue flex items-center justify-center">
                                            <FaCheck />
                                        </span>

                                        <span className="text-gray-700 font-medium">
                                            {amenity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking form */}
                    <aside className="lg:col-span-4 col-span-12">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 lg:sticky lg:top-28">

                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${room.price}
                                    </span>

                                    <span className="text-gray-500 text-sm">
                                        /night
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-primary-Blue">
                                    <FaStar />

                                    <span className="font-semibold">
                                        {room.rating}
                                    </span>

                                    <span className="text-xs">
                                        ({room.reviews} reviews)
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden mt-6">
                                <div className="p-3 border-r border-gray-300">
                                    <label
                                        htmlFor="checkIn"
                                        className="block text-xs font-bold uppercase"
                                    >
                                        Check-in
                                    </label>

                                    <input
                                        id="checkIn"
                                        name="checkIn"
                                        type="date"
                                        value={bookingData.checkIn}
                                        onChange={handleChange}
                                        className="w-full mt-1 outline-none text-sm"
                                    />
                                </div>

                                <div className="p-3">
                                    <label
                                        htmlFor="checkOut"
                                        className="block text-xs font-bold uppercase"
                                    >
                                        Check-out
                                    </label>

                                    <input
                                        id="checkOut"
                                        name="checkOut"
                                        type="date"
                                        value={bookingData.checkOut}
                                        onChange={handleChange}
                                        className="w-full mt-1 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="border border-gray-300 rounded-xl p-3 mt-4">
                                <label
                                    htmlFor="guests"
                                    className="block text-xs font-bold uppercase"
                                >
                                    Guests
                                </label>

                                <select
                                    id="guests"
                                    name="guests"
                                    value={bookingData.guests}
                                    onChange={handleChange}
                                    className="w-full mt-1 outline-none bg-white"
                                >
                                    <option value="1 Adult">1 Adult</option>
                                    <option value="2 Adults">2 Adults</option>
                                    <option value="3 Adults">3 Adults</option>
                                    <option value="4 Adults">4 Adults</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={handleBooking}
                                className="w-full bg-primary-Blue text-white py-3 rounded-xl font-semibold mt-5 cursor-pointer hover:opacity-90 transition"
                            >
                                Book This Room
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-3">
                                No immediate charge. Free cancellation until
                                48 hours before arrival.
                            </p>
                        </div>
                    </aside>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default DetailRoom;