import Button from "../button/Button"
import AppLink from "../navigation/AppLink";

function Card({id, slug, images, title, description,price}){
  const bookingHref = `/booking?room=${encodeURIComponent(slug || id || '')}`;
  return (
    <div className=" place-content-center place-items-center bg-bgCard">
        <div key={id} className=" border border-gray-400 rounded-lg block max-w-sm rounded-base backdrop:block-md shadow-lg hover:scale-90 transition-transform duration-200 ">
            <AppLink to={bookingHref}>
                <img className="rounded-t-md max-w-full" src={images} alt="" />
            </AppLink>
            <AppLink to={bookingHref}>
                <h5 className="text-start pl-5 mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
                    {title}
                </h5>
            </AppLink>
            <p className="mb-6 text-body text-start px-5">{description}</p>
            <section className="flex justify-between pb-4 px-4">
                <h3 className="text-primary-Blue">${price}<sub>/night</sub></h3>
                <AppLink to={bookingHref}><Button text={"Book Now"} bg={"bg-primary-Blue"}/></AppLink>

            </section>

            <section>
                
            </section>
        </div>


    </div>
  )
}

export default Card
