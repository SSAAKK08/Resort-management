import Navbar from "../hearder&footer/Navbar";
import Footer from "../hearder&footer/Footer";
import banner from "../../assets/promotion/banner.jpg";
import zipLine from "../../assets/Activites/zipLine.png";
import room2 from "../../assets/homeImg/room2.jpg";
import food4 from "../../assets/restaurant/food4.jpg";
import { dataPromotion } from "../cards/CompoPromotion";
import CompoPromotion from "../cards/CompoPromotion";


function Promotion() {
  return (
    <div>
        <Navbar/>

        <div className="w-full h-screen bg-center bg-no-repeat bg-cover overflow-x-hidden" style={{backgroundImage: `url(${banner})`}}></div>

        <h3 className="lg:text-3xl text-2xl text-gray-900 font-semibold lg:mx-16 mx-3 lg:mt-20 mt-10 ">Curated Experiences <br /> <span>Just For You </span></h3>

        <div className="grid grid-cols-12 lg:mx-16 mx-3 lg:mt-12 mt-6  gap-6">
            <div className="lg:col-span-7  col-span-12 ">
                <img className="rounded-xl h-full w-full object-cover " src={zipLine} alt="" />
            </div>
            
            <div className="lg:col-span-5 col-span-12">
                    <img className="rounded-lg w-full " src={room2} alt="" />
                    <img className="rounded-lg w-full mt-6" src={food4} alt="" />
                
            </div>
        </div>

        <h3 className="text-2xl lg:text-center text-gray-900 font-semibold lg:mx-16 mx-3 lg:mt-20 mt-8 ">Unmatched Resort Amenities</h3>
        

        <div className="lg:flex grid grid-cols-12 lg:gap-6 place-items-center w-full justify-center">
            {dataPromotion.map((mapPromotion) => ( 
                <CompoPromotion
                key={mapPromotion.id}
                id={mapPromotion.id}               
                icon={mapPromotion.icon}
                title={mapPromotion.title}
                description={mapPromotion.description}
                />
            ))}
        </div>




        <Footer/>
    </div>
  )
}

export default Promotion