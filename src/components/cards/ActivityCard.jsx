
const ActivityCard = ({id, images, title, description, isFeatured }) => {
  return (
    
    <div className={`relative rounded-2xl overflow-hidden ${isFeatured ? "lg:col-span-8 col-span-12 lg:row-span-2 h-full" : "lg:col-span-4 h-68 object-cover"}`}>
      
      <img  src={images}  alt={title} className="w-full h-full object-cover"/>

      <div className="absolute inset-0 from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className={`font-bold mb-1 ${isFeatured ? "lg:text-5xl text-2xl text-accent-text " : "text-2xl"}`}> {title} </h3>
        <p className={`${isFeatured ? "lg:text-3xl text-xl mt-3 mb-5" : "text-gray-300 text-sm mb-4"}`}>{description}</p>

        {isFeatured && (
          <button className="flex items-center bg-secondary-gray-700 gap-2 text-white border border-gray-600 hover:border-primary-Blue px-6 py-3 rounded-full font-medium transition-all duration-300"> Book Experience</button>
        )}
      </div>

    </div>
  );
};

export default ActivityCard;