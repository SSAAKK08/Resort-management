'use client';

import { useEffect, useMemo, useState } from "react";
import topbanner from "../../assets/booking/TopBanner.jpg";
import BookingCard from "../cards/BookingCard";
import { normalizeRoom } from "../../lib/catalog";
import { useLocale } from "next-intl";
import BookingCheckoutForm from "./BookingCheckoutForm";


function Booking({ initialRoomSlug = "", initialPromotionCode = "" }){
    const locale = useLocale();

    // make it default with all room 
    const [selectedCategory, setSelectedCategory] = useState("All Rooms");
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        fetch("/api/rooms", { cache: "no-store" })
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok) throw new Error(payload.error || "Unable to load rooms.");
                if (active) setRooms((payload.data || []).map((item) => normalizeRoom(item, locale)));
            })
            .catch((requestError) => {
                if (active) {
                    setError(requestError.message);
                    setRooms([]);
                }
            })
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [locale]);

    const categories = useMemo(() => ["All Rooms", ...new Set(rooms.map((room) => room.category).filter(Boolean))], [rooms]);
    const filteredRooms = selectedCategory === "All Rooms"
        ? rooms
        : rooms.filter((room) => room.category === selectedCategory);


    return (
        <div className="min-h-screen bg-white">


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
                            src={topbanner.src}
                            alt="Swimming pool at the coastal resort"
                        />

                    </div>

                </section>

               {/* {!loading && rooms.length > 0 && <BookingCheckoutForm rooms={rooms} initialRoomSlug={initialRoomSlug} initialPromotionCode={initialPromotionCode} />} */}

                <nav className="lg:mx-16 mx-3 mt-10" aria-label="Room categories" >

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 shadow-sm">

                        <ul className="flex items-center gap-3 overflow-x-auto">

                            {(rooms.length ? categories : ["All Rooms"]).map((category) => (

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

                    {error && <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800" role="status">{error}</p>}

                    {loading ? (
                        <div className="min-h-60 animate-pulse rounded-2xl bg-gray-100" aria-label="Loading rooms" />
                    ) : filteredRooms.length > 0 ? (

            

                        <div className="grid grid-cols-12 gap-6">
                            {filteredRooms.map((bookMapping) => (
                                <BookingCard
                                    key={bookMapping.id}
                                    id={bookMapping.id}
                                    slug={bookMapping.slug}
                                    images={bookMapping.image}
                                    title={bookMapping.title}
                                    price={bookMapping.price}
                                    wifi={bookMapping.wifi}
                                    pool={bookMapping.pool}
                                    // bookingHref={`/booking?room=${encodeURIComponent(bookMapping.slug)}`}
                                    bookingHref={`/booking?room=${encodeURIComponent(
                                    bookMapping.slug || bookMapping.id
                                )}`}
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

             {!loading && rooms.length > 0 && <BookingCheckoutForm rooms={rooms} initialRoomSlug={initialRoomSlug} initialPromotionCode={initialPromotionCode} />}           

        </div>
    );
}


export default Booking;

