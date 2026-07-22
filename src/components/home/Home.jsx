import Navbar from "../hearder&footer/Navbar";
import banner1 from "../../assets/homeImg/bannerHome1.jpg";
import Button from "../button/Button";
import Card from "../cards/Card";
import { data, Activity } from "../data/data";
import ActivityCard from "../cards/ActivityCard";
import drink from "../../assets/homeImg/drink.jpg";
import stack from "../../assets/homeImg/stack.jpg";
import { IoRestaurantSharp } from "react-icons/io5";
import bannerPromotion from "../../assets/homeImg/promotionBanner.jpg";
import Footer from "../hearder&footer/Footer";
import { motion } from "framer-motion";
import {  fadeInUp, fadeInLeft,fadeInRight,scaleUp,staggerContainer,bannerText} from "../../animations/variants";
import { NavLink } from "react-router-dom";

function Home(){
  return (
    <div>

        <Navbar/>

        <div className="w-full h-screen relative bg-center bg-cover bg-no-repeat overflow-x-hidden" 
             style={{ backgroundImage: `url(${banner1})` }} >

          <motion.div className="absolute flex items-center justify-center flex-col h-screen w-screen space-y-4"
                      initial="hidden" animate="visible" variants={staggerContainer} >

              <motion.h3  className="text-center text-white lg:text-4xl text-3xl"  variants={bannerText} >  Welcome to Resort </motion.h3>
            
              <motion.p className="text-center text-white lg:text-2xl text-lg space-x-6"  variants={bannerText} >  
                  Experience the ultimate coastal retreat where luxury meets the serenity of theocean <br />
                  <span className="">Your sanctuary of peace and refined elegance awaits</span>
              </motion.p>

              <motion.div className="flex gap-3.5" variants={bannerText}>

                <NavLink to="/Booking">
                  <Button text={"Booking now"} bg={"bg-primary-Blue"}/>

                </NavLink>
                <NavLink to="/Promotion ">
                  <Button text={"Promotion"} bg={"bg-primary-Blue"}/>

                </NavLink>
              </motion.div>
          </motion.div>

        </div>

        <section className="flex justify-between lg:mx-16 mx-8 lg:mt-20 mt-10 mb-5 ">
          <motion.h2 
            className="lg:text-3xl text-2xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} >
            Luxurious Sanctuaries
          </motion.h2>
          <a href="#" >View All rooms</a>
        </section>

          {/* Map room */}
          <motion.section 
            className="grid lg:grid-cols-3 grid-cols-1 gap-6 lg:mx-10 mx-3" initial="hidden" whileInView="visible" viewport={{ once: true }}  variants={staggerContainer}  >
            
            {data.map((data) => (
              <motion.div key={data.id} variants={scaleUp}>
                <Card 
                  images= {data.images}
                  title={data.title}
                  description = {data.description}
                  price = {data.price}
                />
              </motion.div>
            ))}
          </motion.section>
        
          {/* Map activity */}
          <motion.h4 className="lg:text-center mx-3 lg:text-4xl text-3xl mt-20"  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}> Explore Resort </motion.h4> 


          <motion.section className="grid grid-cols-12 gap-6 lg:mx-16 mx-3 mt-10 lg:h-[600px]"  initial="hidden"  whileInView="visible" 
              viewport={{ once: true }}  variants={staggerContainer}>

              {Activity.map((dataActi) => (
                <motion.div  
                  key={dataActi.id}  
                  variants={fadeInUp}
                  className={
                    dataActi.id === 1 
                      ? "lg:col-span-7 col-span-12 lg:row-span-2 lg:h-full"  
                      : dataActi.id === 2 
                        ? "lg:col-span-5 col-span-12 lg:col-start-8 col-end-13 row-start-1 h-full"
                        : "lg:col-span-5 col-span-12 lg:col-start-8 col-end-13 row-start-2 h-full"
                  }
                >
                  <ActivityCard
                    images={dataActi.images}
                    title={dataActi.title}
                    description={dataActi.description}
                    isFeatured={dataActi.id === 1}
                  />
                </motion.div>
              ))}
            </motion.section>

          
        {/* Resturant */}

        <motion.section  className="grid grid-cols-9 gap-7 lg:mx-16 mx-4 lg:mt-20 mt-10 "
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} >
            <motion.img  className=" rounded-md lg:col-span-3 col-span-12"   src={drink}  alt="drink" variants={fadeInLeft} /> 
            <motion.img className=" rounded-md lg:col-span-2 col-span-12 lg:h-60 h-full lg:w-54 w-full   place-content-center place-items-center" src={stack} alt="drink" variants={fadeInRight} />
            
            <motion.section className="lg:col-span-4 col-span-12" variants={fadeInUp}>
              <h3 className="lg:text-3xl text-2xl">Epicurean Delights</h3>
              <p className="lg:text-lg text-sm mt-2 ml-2">Our world-class chefs curate a gourmet dining experience for every palate.</p>

              <section className="p-3 border px-5 rounded-lg mt-3 ">
                <section className="flex justify-between ">
                  <section>
                    <h5 className="text-sm ">Exclusive Dining Offer</h5>
                    <h5 className="text-lg text-primary-Blue mb-3 ">Enjoy 20% OFF your first dinner with us tonight using code FIRST20! </h5>
                  </section>
                  <IoRestaurantSharp className="text-5xl" />
                </section>
                <NavLink to="/Restaurant">
                  <Button text={"Reserve table"} bg={"bg-primary-Blue"}/>

                </NavLink>
              </section>              
            </motion.section>
        </motion.section>

        {/* promotion banner  */}

        <motion.section className="relative h-108 bg-center w-auto lg:mx-16 mx-3 rounded-2xl mt-20 lg:mb-20 mb-12 bg-no-repeat bg-cover overflow-x-hidden " 
            style={{backgroundImage: `url(${bannerPromotion})`}} initial="hidden" whileInView="visible" viewport={{ once: true }}  variants={fadeInUp} >
              
              <div className="absolute inset-0 flex flex-col justify-center items-center   ">
                <motion.h3 className="text-white lg:text-4xl text-2xl"  variants={bannerText}> Summer Serenity Package </motion.h3>
                <motion.p  className="text-white lg:text-xl text-sm text-center mt-4 mb-3"  variants={bannerText} >

                  Book a 5-night stay and enjoy complimentary spa treatments, daily breakfast buffet, and 
                    airport transfers. <br/> <span className="text-center block ">Redefine your summer tranquility.</span> 
                </motion.p> 

                <motion.div variants={bannerText}>
                    <Button text={"30% OFF"} bg={"bg-primary-Blue"}/>
                </motion.div>
              </div> 
        </motion.section>

        <Footer/>

    </div>
  ) 
}

export default Home





// import Navbar from "../hearder&footer/Navbar";
// import banner1 from "../../assets/homeImg/bannerHome1.jpg";
// import Button from "../button/Button";
// import Card from "../cards/Card";
// import { data, Activity } from "../data/data";
// import ActivityCard from "../cards/ActivityCard";
// import drink from "../../assets/homeImg/drink.jpg";
// import stack from "../../assets/homeImg/stack.jpg";
// import { IoRestaurantSharp } from "react-icons/io5";
// import bannerPromotion from "../../assets/homeImg/promotionBanner.jpg";
// import Footer from "../hearder&footer/Footer";

// function Home(){
//   return (
//     <div>

//         <Navbar/>

//         {/* Banner */}
//         <div className="w-full h-screen relative bg-center bg-cover bg-no-repeat overflow-x-hidden" style={{ backgroundImage: `url(${banner1})` }}  >

//           <div className="absolute flex items-center justify-center flex-col h-screen w-screen space-y-4">
//             <h3 className="text-center text-white text-4xl">Welcome to Resort</h3>
//             <p className="text-center text-white text-2xl space-x-6">Experience the ultimate coastal retreat where luxury meets the serenity of theocean 
//               <br /><span className="">Your sanctuary of peace and refined elegance awaits</span></p>
//             <div className="flex gap-3.5">
//               <Button text={"Booking now"} bg={"bg-primary-Blue"}/>
//               <Button text={"Promotion"} bg={"bg-primary-Blue"}/>

//             </div>

//           </div>
//         </div>

//         <section className="flex justify-between mx-16 mt-20 mb-5 ">
//           <h2 className="text-3xl ">Luxurious Sanctuaries</h2>
//           <a href="#" >View All rooms</a>
//         </section>

//           {/* Map room */}
//           <section className="grid grid-cols-3 gap-6 mx-10">

//             {data.map((data) => (
//               <Card 
//                 key={data.id}
//                 images= {data.images}
//                 title={data.title}
//                 description = {data.description}
//                 price = {data.price}
//               />
//             ))}
          
//         </section>
        
//         {/* Map activity */}
//         <h4 className="text-center text-4xl mt-20 ">Explore Resort</h4>
//         <section className="grid grid-cols-12 gap-6 mx-16 mt-10">
//           {Activity.map((dataActi) => (
//               <ActivityCard
//                 key={dataActi.id}
//                 images={dataActi.images}
//                 title={dataActi.title}
//                 description={dataActi.description}
//                 isFeatured={dataActi.id === 1}
//               />
            
//           ))}
//         </section>
          
//         {/* Resturant */}

//         <section className="grid grid-cols-9 gap-7 mx-16 mt-20 ">
//             <img className=" rounded-md col-span-3" src={drink} alt="drink"/>
//             <img className=" rounded-md col-span-2 h-60 w-54 place-content-center place-items-center" src={stack} alt="drink"/>
//             <section className="col-span-4">
//               <h3 className="text-3xl">Epicurean Delights</h3>
//               <p className="text-lg mt-2 ml-2">Our world-class chefs curate a gourmet dining experience for every palate.</p>

//               <section className="bg-bgEggColor px-5 py-2 rounded-lg mt-3 ">
//                 <section className="flex justify-between ">
//                   <section>
//                     <h5 className="text-sm ">Exclusive Dining Offer</h5>
//                     <h5 className="text-lg text-primary-Blue mb-3 ">Enjoy 20% OFF your first dinner with us tonight using code FIRST20! </h5>

//                   </section>
//                   <IoRestaurantSharp className="text-5xl" />

//                 </section>
//                 <Button text={"Reserve table"} bg={"bg-primary-Blue"}/>
//               </section>              
//             </section>

//         </section>

//         {/* promotion banner  */}

//         <section className="relative h-108 bg-center w-auto mx-16 rounded-2xl mt-20 mb-20 bg-no-repeat bg-cover overflow-x-hidden " style={{backgroundImage: `url(${bannerPromotion})`}}>
//               <div className="absolute inset-0 flex flex-col justify-center items-center   ">
//                 <h3 className="text-white text-4xl ">Summer Serenity Package</h3>
//                 <p className="text-white text-xl mt-4 mb-3">Book a 5-night stay and enjoy complimentary spa treatments, daily breakfast buffet, and 
//                     airport transfers. <br/> <span className="text-center block ">Redefine your summer tranquility.</span> </p> 
//                 <Button text={"30% OFF"} bg={"bg-primary-Blue"}/>
//               </div> 
          
//         </section>

//         <Footer/>

//     </div>
//   ) 
// }

// export default Home

