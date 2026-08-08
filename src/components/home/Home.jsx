'use client';
import { useEffect, useState } from "react";
import banner1 from "@/assets/homeImg/bannerHome1.jpg";
import Button from "../button/Button";
import Card from "../cards/Card";
import ActivityCard from "../cards/ActivityCard";
import drink from "../../assets/homeImg/drink.jpg";
import stack from "../../assets/homeImg/stack.jpg";
import { IoRestaurantSharp } from "react-icons/io5";
import bannerPromotion from "../../assets/homeImg/promotionBanner.jpg";
import { motion } from "framer-motion";
import {  fadeInUp, fadeInLeft,fadeInRight,scaleUp,staggerContainer,bannerText} from "../../animations/variants";
import NavLink from "../navigation/AppLink";
import Link from "next/link";
import { normalizeActivity, normalizeRoom } from "../../lib/catalog";
import { useLocale, useTranslations } from "next-intl";

function Home(){
  const t = useTranslations('Home');
  const locale = useLocale();
  const [rooms, setRooms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch('/api/rooms', { cache: 'no-store' }).then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error); return payload; }),
      fetch('/api/activities', { cache: 'no-store' }).then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error); return payload; }),
    ]).then(([roomPayload, activityPayload]) => {
      setRooms((roomPayload.data || []).map((item) => normalizeRoom(item, locale)).slice(0, 3));
      setActivities((activityPayload.data || []).map((item) => normalizeActivity(item, locale)).slice(0, 3));
    }).catch((error) => setCatalogError(error.message || t('loadError')));
  }, [locale, t]);
  return (
    <div>


        <div className="w-full h-screen relative bg-center bg-cover bg-no-repeat overflow-x-hidden" 
             style={{ backgroundImage: `url(${banner1.src})` }} >

          <motion.div className="absolute flex items-center justify-center flex-col h-screen w-screen space-y-4"
                      initial="hidden" animate="visible" variants={staggerContainer} >

              <motion.h3  className="text-center text-white lg:text-4xl text-3xl"  variants={bannerText}>{t('welcome')}</motion.h3>
            
              <motion.p className="text-center text-white lg:text-2xl text-lg space-x-6"  variants={bannerText} >  
                  {t('hero')} <br />
                  <span>{t('heroSecond')}</span>
              </motion.p>

              <motion.div className="flex gap-3.5" variants={bannerText}>

                <Link href={"/booking"}>
                  <Button text={t('bookNow')} bg={"bg-primary-Blue"}/>

                </Link>

                <Link href={"/promotion"}>
                  <Button text={t('promotion')} bg={"bg-primary-Blue"}/>

                </Link>
              </motion.div>
          </motion.div>

        </div>

        <section className="flex justify-between lg:mx-16 mx-8 lg:mt-20 mt-10 mb-5 ">
          <motion.h2 
            className="lg:text-3xl text-2xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} >
            {t('roomsTitle')}
          </motion.h2>
          <Link href="/booking">{t('viewRooms')}</Link>
        </section>

          {/* Map room */}
          <motion.section 
            className="grid lg:grid-cols-3 grid-cols-1 gap-6 lg:mx-10 mx-3" initial="hidden" whileInView="visible" viewport={{ once: true }}  variants={staggerContainer}  >
            
            {rooms.map((data) => (
              <motion.div key={data.documentId || data.id} variants={scaleUp}>
                <Card 
                  id={data.id}
                  slug={data.slug}
                  images= {data.image}
                  title={data.title}
                  description = {data.description}
                  price = {data.price}
                />
              </motion.div>
            ))}
          </motion.section>
        
          {/* Map activity */}
          <motion.h4 className="lg:text-center mx-3 lg:text-4xl text-3xl mt-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>{t('explore')}</motion.h4>

          <motion.section className="grid grid-cols-12 gap-6 lg:mx-16 mx-3 mt-10 lg:grid-rows-2"  initial="hidden"  whileInView="visible" 
              viewport={{ once: true }}  variants={staggerContainer}>

              {catalogError && <p className="col-span-12 rounded-xl bg-amber-50 p-4 text-amber-800">{catalogError}</p>}
            {activities.map((dataActi, activityIndex) => (
                <motion.div  
                  key={dataActi.documentId || dataActi.id}  
                  variants={fadeInUp}
                  className={
                    activityIndex === 0
                      ? "col-span-12 min-h-[560px] lg:col-span-7 lg:row-span-2"
                      : activityIndex === 1
                        ? "col-span-12 min-h-[268px] lg:col-span-5 lg:col-start-8 lg:row-start-1"
                        : "col-span-12 min-h-[268px] lg:col-span-5 lg:col-start-8 lg:row-start-2"
                  }
                >
                  <ActivityCard
                    images={dataActi.image}
                    title={dataActi.title}
                    description={dataActi.description}
                    slug={dataActi.slug}
                    isFeatured={activityIndex === 0}
                  />
                </motion.div>
              ))}
            </motion.section>
          
        {/* Resturant */}

        <motion.section  className="grid grid-cols-9 gap-7 lg:mx-16 mx-4 lg:mt-20 mt-10 "
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} >
            <motion.img className=" rounded-md lg:col-span-3 col-span-12"   src={drink.src}  alt="drink" variants={fadeInLeft} />
            <motion.img className=" rounded-md lg:col-span-2 col-span-12 lg:h-60 h-full lg:w-54 w-full   place-content-center place-items-center" src={stack.src} alt="drink" variants={fadeInRight} />
            
            <motion.section className="lg:col-span-4 col-span-12" variants={fadeInUp}>
              <h3 className="lg:text-3xl text-2xl">{t('diningTitle')}</h3>
              <p className="lg:text-lg text-sm mt-2 ml-2">{t('diningBody')}</p>

              <section className="mt-3 rounded-lg border border-slate-200 p-3 px-5 dark:border-slate-700">
                <section className="flex justify-between ">
                  <section>
                    <h5 className="text-sm">{t('diningOffer')}</h5>
                    <h5 className="mb-3 text-lg text-primary-Blue">{t('diningDiscount')}</h5>
                  </section>
                  <IoRestaurantSharp className="text-5xl" />
                </section>
                <NavLink to="/restaurant">
                  <Button text={t('reserve')} bg={"bg-primary-Blue"}/>

                </NavLink>
              </section>              
            </motion.section>
        </motion.section>

        {/* promotion banner  */}

        <motion.section className="relative h-108 bg-center w-auto lg:mx-16 mx-3 rounded-2xl mt-20 lg:mb-20 mb-12 bg-no-repeat bg-cover overflow-x-hidden " 
            style={{backgroundImage: `url(${bannerPromotion.src})`}} initial="hidden" whileInView="visible" viewport={{ once: true }}  variants={fadeInUp} >
              
              <div className="absolute inset-0 flex flex-col justify-center items-center   ">
                <motion.h3 className="text-white lg:text-4xl text-2xl" variants={bannerText}>{t('summer')}</motion.h3>
                <motion.p  className="text-white lg:text-xl text-sm text-center mt-4 mb-3"  variants={bannerText} >

                  {t('summerBody')} <br/> <span className="block text-center">{t('summerClose')}</span>
                </motion.p> 

                <motion.div variants={bannerText}>
                    <Button text={"30% OFF"} bg={"bg-primary-Blue"}/>
                </motion.div>
              </div> 
        </motion.section>


    </div>
  ) 
}

export default Home




