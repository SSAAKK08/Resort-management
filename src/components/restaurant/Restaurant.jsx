import Navbar from "../hearder&footer/Navbar";
import bannerRestaurant1 from "../../assets/restaurant/bannerRestaurant1.jpg";
import chef from "../../assets/restaurant/chef.jpg";
import { LuLeaf } from "react-icons/lu";
import { FaGlassMartiniAlt } from "react-icons/fa";
import { food } from "../data/ResData";
import ResCard from "../cards/ResCard";
import ReverseTable from "./ReverseTable";
import waiter from "../../assets/restaurant/waiter.jpg";
import Footer from "../hearder&footer/Footer";

function Restaurant(){
  return (
    <div>

        <Navbar/>
        <div className="w-full h-screen bg-cover bg-no-repeat bg-center overflow-x-hidden relative flex justify-center items-center " style={{backgroundImage: `url(${bannerRestaurant1})`}}>
            <div className="absolute text-center">
                {/* <h4 className=" text-3xl text-white">SAVOR THE EXTRAORDINARY</h4> */}
                <h5 className="mb-4 lg:text-4xl text-2xl text-gray-200">Azurea Epicurean</h5>
                <p className="lg:text-2xl text-lg lg:mx-16 mx-6 text-gray-100 ">Where the rhythm of the ocean meets the art of refined gastronomy.
                    An immersive sensory journey curated by Michelin-starred excellence.</p>
            </div>
 
        </div>

        <div className="grid grid-cols-9 lg:mt-30 mt-16 lg:mx-16 mx-4 gap-8 lg:mb-16 mb-8">
            <div className="lg:col-span-4 col-span-12 place-items-center">
                <img className="rounded-lg" src={chef} alt="chef cooking"/>
            </div>

            <div className="lg:col-span-5 col-span-12 place-content-center  ">
                <h3 className="lg:text-3xl text-2xl font-semibold text-secondary-title">A Symphony of Earth and Sea</h3>
                <p className="lg:text-xl text-sm mt-3">Our culinary ethos is rooted in the purity of ingredients. We
                    believe that luxury is found in the simplicity of nature,
                    elevated through innovative techniques and a deep respect
                    for heritage.
                </p>
                <div className="grid grid-cols-12 mt-8 ">
                    <div className="col-span-6">
                        <LuLeaf className="size-7 text-primary-Blue "/>
                        <h4 className=" font-bold text-lg mt-2 ">Sustainable Sourcing</h4>
                        <p>Supporting regional farmers and ethical practices.</p>
                    </div>

                    <div className="col-span-6">
                        <FaGlassMartiniAlt className="size-7 text-primary-Blue"/>
                        <h4 className=" font-bold text-lg mt-2 ">Sommelier Curation</h4>
                        <p>Vintages selected from world renowned private estates.</p>
                    </div>

                </div>
            </div>
        </div>
        

        <h3 className="lg:text-3xl text-xl font-semibold lg:mx-16 mx-3 mb-8">The Epicurean Menu</h3>

        <div className="grid grid-cols-12 lg:mx-16 mx-3  gap-2.5">

            {food.map((foodMap) => (
                <ResCard
                    images={foodMap.images}
                    title={foodMap.foodName}
                    description={foodMap.foodDescribtion}
                    price={foodMap.price}
                    typesof={foodMap.typesof}
                />
            ))}

        </div>

        <div className="grid grid-cols-12 mt-20 mb-16">

            <div className="lg:col-span-6 col-span-12 ">
                <ReverseTable/>
            </div>
            
            <div className="lg:col-span-6 col-span-12 place-content-center lg:mr-16 mx-3 lg:mt-0 mt-8">
                <img className="rounded-2xl" src={waiter} alt="" />
                
            </div>
        </div>

        <Footer/>
    </div>
    
  )
}

export default Restaurant
