function CompoPromotion({ id, icon, title, description }) {
  return (
    <div className="border w-40 h-36 p-3 rounded-lg lg:mt-12 mt-6 lg:mb-20 col-span-6 mb-4" key={id}>
      <div className="text-2xl mb-2 text-primary-Blue">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm line-clamp-3 ">{description}</p>
    </div>
  );
}

export default CompoPromotion;


import { GiWaveCrest } from "react-icons/gi";
import { IoMdRestaurant } from "react-icons/io";
import { FaPersonSwimming } from "react-icons/fa6";
import { PiFlowerTulipDuotone } from "react-icons/pi";

export const dataPromotion = [
  {
    id: 1,
    icon: <GiWaveCrest />,
    title: "Ocean View",
    description: "Panoramic windows overlooking the turquoise horizon of the Azure Sea.",
  },
  {
    id: 2,
    icon: <IoMdRestaurant />,
    title: "Private Dining",
    description: "Michelin-star culinary journeys served in the privacy of your private terrace.",
  },
  {
    id: 3,
    icon: <FaPersonSwimming />,
    title: "Infinity Pool",
    description: "Award-winning temperature controlled infinity pools with swim up bars.",
  },
  {
    id: 4,
    icon: <PiFlowerTulipDuotone />,
    title: "Spa Retreat",
    description: "Ancient healing rituals combined with modern luxury wellness treatments.",
  },
];



