import Navbar from "../hearder&footer/Navbar";
import Footer from "../hearder&footer/Footer";
import banner from "../../assets/Activites/banner.png"
import scubaDiving from "../../assets/homeImg/ScubaDiving.jpg"; 
import zipLine from "../../assets/Activites/zipLine.png"; 
import swimmingPool from "../../assets/homeImg/swimmingPool.jpg";
import fishingBoot from "../../assets/Activites/fishingBoot.jpg";
import resortStaff from "../../assets/Activites/resortStaff.png";
import { GrUserManager } from "react-icons/gr";
import { FaPersonSwimming } from "react-icons/fa6";

function Activity() {
  return (
    <div>
        <Navbar/>
            <div className="w-full h-screen bg-center bg-no-repeat bg-cover overflow-x-hidden" style={{backgroundImage: `url(${banner})`}}>
                
            </div>

            <h2 className="lg:text-3xl text-2xl lg:mt-16 mt-6 font-semibold lg:mx-16 mx-3 text-gray-900">Activity in Resort</h2>

            <div className="grid grid-cols-12 lg:mt-8 mt-5 lg:mx-16 mx-3 lg:gap-6 gap-2">
                    <div className="lg:col-span-5 col-span-12 relative">
                        <img className="rounded-xl h-full w-full object-cover " src={zipLine} alt="" />
                        <div className="flex-col gap-2 absolute bottom-4 left-4">
                            <h3 className="lg:text-2xl text-xl bottom-4 text-white left-4 font-semibold  drop-shadow-lg">Zip Line</h3>
                            <h3 className="lg:text-2xl text-xl bottom-6 text-white left-4 font-semibold bg-white/15 backdrop-blur-5xl px-3 py-1 drop-shadow-lg">Time :1hour</h3>
                        </div>
                    </div>

                    <div className="lg:col-span-7 col-span-12">
                        <div className="relative">
                            <img className="rounded-lg  " src={swimmingPool} alt="" />

                            <div className="flex-col gap-4 absolute bottom-4 left-4">
                                <h3 className="lg:text-2xl text-xl bottom-4 text-white left-4 font-semibold  drop-shadow-lg">Swimming pool </h3>
                                <h3 className="lg:text-2xl text-xl bottom-6 text-white left-4 font-semibold rounded-md bg-white/15 backdrop-blur-5xl px-3 py-1   drop-shadow-lg">Time: 1hour</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-12 lg:gap-6 gap-2 mt-2">
                            <div className="col-span-6 ">
                                <img className="rounded-md overflow-hidden aspect-[4/3]" src={scubaDiving} alt="" />
                            </div>

                            <div className="col-span-6 w-full  ">
                                <img className="rounded-md aspect-[4/3] overflow-hidden" src={fishingBoot} alt="" />
                            </div>
                        </div>
                        
                    </div>
                </div>


                <div className="grid grid-cols-12 lg:mx-16 mx-3 lg:mt-24 mt-8 mb-12 ">
                    <div className="col-span-7 ">

                        <h3 className="lg:text-4xl text-2xl text-gray-900 font-semibold ">Uncompromising <br /><span className="lg:text-4xl text-2xl text-gray-900 font-semibold "> Excellence</span></h3>
                        <div className="lg:mt-8 mt-4 mb-4">
                            <div className="flex gap-1 items-center">
                                <FaPersonSwimming className="lg:h-16 text-primary-Blue" />
                                <h3 className="lg:text-xl text-lg text-gray-900 font-semibold ">Premium Equipment</h3>  
                            </div>
                            <p className="lg:text-lg text-sm lg:ml-0 ml-6 text-gray-700 col-start-2">We provide only the finest professional-grade gear for every excursion. From titanium dive watches to custom fitted sailing apparel, your safety and comfort are paramount.</p>

                        </div>

                        <div>
                            <div className="flex gap-1 items-center-safe">
                                <GrUserManager className=" h-10 text-primary-Blue" />
                                <h3 className="text-xl text-gray-900 font-semibold">Private Concierge</h3>  

                            </div>
                            <p className="lg:text-lg text-sm lg:ml-0 ml-6 text-gray-700 col-start-2">A dedicated experience curator is at your disposal 24/7 to tailor itineraries, secure exclusive access, and ensure every detail of your stay is effortlessly managed.</p>

                        </div>
                    </div>

                    <div className="col-span-5 flex items-center justify-center">
                        <img className="h-96 " src={resortStaff} alt="resort Staff"/>
                    </div>
                    
                </div>

        <Footer/>
    </div>
  )
}

export default Activity

