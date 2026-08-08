
import AppLink from '../navigation/AppLink';

const fallbackImage = '/assets/Activites/banner.png';

const ActivityCard = ({images, title, description, isFeatured, slug }) => {
  return (
    
    <div className="relative h-full min-h-72 overflow-hidden rounded-2xl">
      
      <img
        src={images || fallbackImage}
        alt={title}
        className="w-full h-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />

      <div className="absolute inset-0 from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className={`font-bold mb-1 ${isFeatured ? "lg:text-5xl text-2xl text-accent-text " : "text-2xl"}`}> {title} </h3>
        <p className={`${isFeatured ? "lg:text-3xl text-xl mt-3 mb-5" : "text-gray-300 text-sm mb-4"}`}>{description}</p>

        {isFeatured && (
          <AppLink to={`/activities/${slug}`} className="flex w-fit items-center bg-secondary-gray-700 gap-2 text-white border border-gray-600 hover:border-primary-Blue px-6 py-3 rounded-full font-medium transition-all duration-300">View Details</AppLink>
        )}
      </div>

    </div>
  );
};

export default ActivityCard;
