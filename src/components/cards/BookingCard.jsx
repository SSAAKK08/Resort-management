
// function BookingCard({id, images, title, price, wifi: WifiIcon, pool: MdOutlinePool}){
//   return (
//     <div className=" place-content-center place-items-center bg-bgCard lg:col-span-4 col-span-12 gap-2.5 mb-10 lg:mt-5 mt-4">
//         <div key={id} className=" border border-gray-400 rounded-lg block max-w-sm rounded-base backdrop:block-md transition-transform duration-200 ">
//             <a href="#">
//                 <img className="rounded-t-md max-w-full " src={images} alt=""/>
//             </a>

//             <section className="flex justify-between px-5 pt-5 ">
//                 <a href="#">
//                     <h5 className="text-start text-2xl font-semibold tracking-tight text-heading"> {title} </h5>
//                 </a>

//                 <h3 className="text-start text-primary-Blue text-lg font-semibold tracking-tight text-heading">${price}<sub className="text-lg">/night</sub></h3>
//             </section>

//             <section className="flex gap-3 pl-5 pt-3">
//                 <h4 className="text-black flex gap-1.5"><WifiIcon size={20}/> <span>Wifi</span> </h4>
//                 <h4 className="text-black flex gap-1.5"><MdOutlinePool size={20}/><span>Swimming pool</span></h4>
            
//             </section>
            
//             <div className=" flex gap-5 p-5">
//                 <button type="button" className={`text-black hover:scale-90 bg-neutral-secondary-medium w-56 border-black border hover:bg-brand-strong focus:ring-4 
//                     focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none`}>View detail
//                 </button>

//                 <button type="button" className={`text-white hover:scale-90 bg-primary-Blue w-56  border-transparent border hover:bg-brand-strong focus:ring-4 
//                     focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none`}>Book
//                 </button>
//             </div>            

//         </div>
//     </div>
//   )
// }

// export default BookingCard


import { Link } from "react-router-dom";
import { FaWifi, FaSwimmingPool } from "react-icons/fa";

function BookingCard({
    id,
    images,
    title,
    price,
    wifi,
    pool,
}) {
    return (
        <article className="lg:col-span-4 md:col-span-6 col-span-12 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">

            <Link to={`/rooms/${id}`}>
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

                <Link
                    to={`/rooms/${id}`}
                    className="block text-center mt-5 py-3 rounded-xl bg-primary-Blue text-white font-semibold hover:opacity-90 transition"
                >
                    View Details
                </Link>
            </div>
        </article>
    );
}

export default BookingCard;