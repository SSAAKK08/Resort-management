import { useState } from "react";
import Navbar from "../hearder&footer/Navbar";
import topbanner from "../../assets/booking/TopBanner.jpg";
import BookingCard from "../cards/BookingCard";
import { cardData, roomCategories } from "../data/dataBooking";
import Footer from "../hearder&footer/Footer";


function Booking() {

    // make it default with all room 
    const [selectedCategory, setSelectedCategory] = useState("All Rooms");


    const filteredRooms = selectedCategory === "All Rooms"
        ? cardData
        : cardData.filter((room) => room.category === selectedCategory);


    return (
        <div className="min-h-screen bg-white">

            <Navbar/>

            <main>

                <section className="grid grid-cols-12 lg:mx-16 mx-6 items-center lg:gap-12 gap-6 lg:mt-30 mt-20">

                    <div className="lg:col-span-6 col-span-12 items-center">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#006492] mb-2">Resort Accommodation </p>

                        <h2 className="text-[#006492] lg:text-5xl md:text-4xl text-3xl font-bold mb-4"> Our Sanctuaries </h2>

                        <p className="text-gray-600 lg:text-lg text-base leading-7 lg:mr-12 mb-5">
                            Discover a collection of meticulously designed spaces
                            where coastal serenity meets modern elegance. Each room
                            is a private haven crafted for the ultimate restoration
                            of body and mind.
                        </p>

                    </div>


                    <div className="lg:col-span-6 col-span-12">

                        <img
                            className="w-full lg:h-[420px] md:h-[350px] h-[260px] object-cover rounded-3xl shadow-lg"
                            src={topbanner}
                            alt="Swimming pool at the coastal resort"
                        />

                    </div>

                </section>

                <nav className="lg:mx-16 mx-3 mt-10" aria-label="Room categories" >

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 shadow-sm">

                        <ul className="flex items-center gap-3 overflow-x-auto">

                            {roomCategories.map((category) => (

                                <li key={category}  className="shrink-0">

                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory(category)}
                                        className={`
                                            px-5 py-2.5
                                            rounded-xl
                                            text-sm font-semibold
                                            transition-all duration-300
                                            cursor-pointer
                                            ${
                                                selectedCategory === category
                                                    ? "bg-primary-Blue text-white shadow-md"
                                                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-primary-Blue"
                                            }
                                        `}
                                    >
                                        {category}
                                    </button>

                                </li>
                            ))}

                        </ul>

                    </div>

                </nav>

                <section className="lg:mx-8 mx-3 mt-8 mb-16">

                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h3 className="text-2xl font-bold text-gray-800"> {selectedCategory}  </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {/* store value */}
                                {filteredRooms.length}
                                {/* take it to compare */}
                                {filteredRooms.length === 1 ? " room" : " rooms"} available
                            </p>

                        </div>

                    </div>

                    {filteredRooms.length > 0 ? (

            

                        <div className="grid grid-cols-12 gap-6">
                            {filteredRooms.map((bookMapping) => (
                                <BookingCard
                                    key={bookMapping.id}
                                    id={bookMapping.id}
                                    images={bookMapping.image}
                                    title={bookMapping.title}
                                    price={bookMapping.price}
                                    wifi={bookMapping.wifi}
                                    pool={bookMapping.pool}
                                />
                            ))}
                        </div>

                    ) : (

                        <div className="flex flex-col items-center justify-center min-h-60 bg-gray-50 border border-gray-200 rounded-2xl text-center px-5">

                            <h3 className="text-xl font-semibold text-gray-800">  No rooms found </h3>

                            <p className="text-gray-500 mt-2"> There are currently no rooms available in this category. </p>

                        </div>
                    )}
                </section>
            </main>

            <Footer/>

        </div>
    );
}


export default Booking;

