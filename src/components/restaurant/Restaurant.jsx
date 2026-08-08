'use client';

import { useEffect, useState } from "react";
import bannerRestaurant1 from "../../assets/restaurant/bannerRestaurant1.jpg";
import chef from "../../assets/restaurant/chef.jpg";
import { LuLeaf } from "react-icons/lu";
import { FaGlassMartiniAlt } from "react-icons/fa";
import { food } from "../data/ResData";
import ResCard from "../cards/ResCard";
import ReverseTable from "./ReverseTable";
import waiter from "../../assets/restaurant/waiter.jpg";
import { normalizeFood } from "../../lib/catalog";
import { useLocale } from "next-intl";

function Restaurant(){
  const locale = useLocale();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/food", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load food.");
        if (active) setFoods((payload.data || []).map((item) => normalizeFood(item, locale)));
      })
      .catch((requestError) => {
        if (active) {
          setError(`${requestError.message} Showing the preserved migration data.`);
          setFoods(food.map((item) => normalizeFood(item, locale)));
        }
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [locale]);

  return (
    <div>

        <div className="w-full h-screen bg-cover bg-no-repeat bg-center overflow-x-hidden relative flex justify-center items-center " style={{backgroundImage: `url(${bannerRestaurant1.src})`}}>
            <div className="absolute text-center">
                {/* <h4 className=" text-3xl text-white">SAVOR THE EXTRAORDINARY</h4> */}
                <h5 className="mb-4 lg:text-4xl text-2xl text-gray-50 font-bold">Welcome to Azurea Epicurean Restaurant</h5>
                {/* <p className="lg:text-2xl text-lg lg:mx-16 mx-6 text-gray-100 ">Where the rhythm of the ocean meets the art of refined gastronomy.
                    An immersive sensory journey curated by Michelin-starred excellence.</p> */}
            </div>
 
        </div>

        <div className="grid grid-cols-9 lg:mt-30 mt-16 lg:mx-16 mx-4 gap-8 lg:mb-16 mb-8">
            <div className="lg:col-span-4 col-span-12 place-items-center">
                <img className="rounded-lg" src={chef.src} alt="chef cooking"/>
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

            {error && <p className="col-span-12 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{error}</p>}
            {loading && <div className="col-span-12 min-h-52 animate-pulse rounded-2xl bg-gray-100" />}
            {!loading && foods.map((foodMap) => (
                <ResCard
                    key={foodMap.documentId || foodMap.slug}
                    id={foodMap.id}
                    slug={foodMap.slug}
                    images={foodMap.image}
                    title={foodMap.name}
                    description={foodMap.description}
                    price={foodMap.price}
                    typesof={foodMap.category}
                />
            ))}

        </div>

        <div className="grid grid-cols-12 mt-20 mb-16">

            <div className="lg:col-span-6 col-span-12 ">
                <ReverseTable/>
            </div>
            
            <div className="lg:col-span-6 col-span-12 place-content-center lg:mr-16 mx-3 lg:mt-0 mt-8">
                <img className="rounded-2xl" src={waiter.src} alt="" />
                
            </div>
        </div>

    </div>
    
  )
}

export default Restaurant
