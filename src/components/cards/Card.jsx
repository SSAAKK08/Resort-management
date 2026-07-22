import Button from "../button/Button"

function Card({id, images, title, description,price}){
  return (
    <div className=" place-content-center place-items-center bg-bgCard">
        <div key={id} className=" border border-gray-400 rounded-lg block max-w-sm rounded-base backdrop:block-md shadow-lg hover:scale-90 transition-transform duration-200 ">
            <a href="#">
                <img className="rounded-t-md max-w-full" src={images} alt="" />
            </a>
            <a href="#">
                <h5 className="text-start pl-5 mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
                    {title}
                </h5>
            </a>
            <p className="mb-6 text-body text-start px-5">{description}</p>
            <section className="flex justify-between pb-4 px-4">
                <h3 className="text-primary-Blue">${price}<sub>/night</sub></h3>
                <Button text={"Booking now"} bg={"bg-primary-Blue"}/>

            </section>

            <section>
                
            </section>
        </div>


    </div>
  )
}

export default Card