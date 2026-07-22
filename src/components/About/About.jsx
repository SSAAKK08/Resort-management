import Navbar from "../hearder&footer/Navbar";
import takingInRoom from "../../assets/about/takingInRoom.jpg";
import { dataAbout } from "../data/about";
import AboutCard from "../cards/AboutCard";
import DeveloperCard from "../cards/DeveloperCard";
import Footer from "../hearder&footer/Footer";
import newBanner from "../../assets/about/newBanner.jpg";
import FormContect from "./FormContect";

function About() {
  return (
    <div>

        <Navbar/>
        <div className="w-full h-screen bg-center bg-no-repeat bg-cover overflow-x-hidden" style={{backgroundImage: `url(${newBanner})`}}>
             
        </div>

        <div className="grid grid-cols-12 gap-12 lg:mx-16 mx-3 lg:mt-28 mt-8">

            <div className="lg:col-span-6 col-span-9 ">
                <h3 className="lg:text-3xl text-2xl mb-6 font-semibold text-secon">A Vision Born from the Azure Horizon</h3>
                <p className=" text-xl mb-8 ">Founded in 1994, Azurea began as a dream to create a sanctuary that respects the natural cadence of the coast. 
                    Our founders, inspired by the shimmering Mediterranean light, sought to bridge the gap between architectural precision and 
                    organic beauty.
                </p>

                <p className=" text-xl ">Over three decades, we have evolved from a boutique hideaway into a global benchmark for luxury, yet our vision 
                    remains unchanged: to provide a space where time slows down and the soul finds its center.
                </p>

            </div>

            <div className="lg:col-span-6 col-span-9 ">
                <img className=" rounded-2xl" src={takingInRoom} alt="taking in room"/>
            </div>
        </div>

        <div className="lg:mt-28 mt-12 ">
            <h3 className="lg:text-3xl text-2xl text-center font-semibold text-gray-900 ">The Azurea Promise</h3>
            <p className="lg:text-xl text-lg text-center mt-2">Our hospitality is built on three pillars of excellence, ensuring every moment of your stay is curated to perfection.</p>
        
            <section className="grid lg:grid-cols-3 place-content-center col-span-12 gap-5 lg:mx-16 mx-3 mt-12">

                {dataAbout.map((mapAbout) => (

                    <AboutCard
                        key={mapAbout.id}
                        icon={mapAbout.icon}
                        title={mapAbout.title}
                        description={mapAbout.description}
                    />
                ))}
            </section>

        </div>

        <h3 className="lg:text-3xl text-2xl mt-12 ml-16">The Hands Behind the Haven</h3>
        
        <div className="grid grid-cols-12 lg:mx-16 mx-3 mt-16 place-items-center mb-12 place-content-center ">
            
            <DeveloperCard/>

            <div className="lg:col-span-7 col-span-12">
                <FormContect/>    
            </div>
            
        </div>

        <Footer/>  

    </div>
  )
}

export default About