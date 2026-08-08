

import Link from "../navigation/AppLink";
import { FaWifi, FaSwimmingPool } from "react-icons/fa";

function BookingCard({
    id,
    slug,
    images,
    title,
    price,
    wifi,
    pool,
    bookingHref,
}) {
    return (
        <article className="lg:col-span-4 md:col-span-6 col-span-12 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">

            <Link to={`/rooms/${slug || id}`}>
                <img
                    src={images}
                    alt={title}
                    className="w-full h-[300px] object-cover"
                />
            </Link>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {title}
                        </h3>

                        <div className="flex items-center gap-4 mt-3 text-gray-500">
                            {wifi && (
                                <span className="flex items-center gap-2">
                                    <FaWifi />
                                    Wi-Fi
                                </span>
                            )}

                            {pool && (
                                <span className="flex items-center gap-2">
                                    <FaSwimmingPool />
                                    Pool
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-primary-Blue font-bold">
                        ${price}
                        <span className="text-xs text-gray-500 font-normal">
                            /night
                        </span>
                    </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link to={`/rooms/${slug || id}`} className="block rounded-xl border py-3 text-center font-semibold text-primary-Blue">View Details</Link>
                    <Link to={bookingHref || `/booking?room=${encodeURIComponent(slug || id)}`} className="block rounded-xl bg-primary-Blue py-3 text-center font-semibold text-white hover:opacity-90">Book Now</Link>
                </div>
            </div>
        </article>
    );
}

export default BookingCard;
