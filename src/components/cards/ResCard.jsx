
function ResCard ({id, images, title, description,price, typesof}){
  return (
    <div className=" place-content-center place-items-center bg-bgCard lg:col-span-3 col-span-12 overy lg:mt-0 mt-8">
        <div key={id} className=" border border-gray-400 rounded-lg block max-w-sm rounded-base backdrop:block-md shadow-lg  transition-transform duration-200 ">
            <a href="#">
                <img className="rounded-t-md max-w-full h-[16rem]" src={images} alt="" />
            </a>
            <a href="#">
                <h5 className="text-start pl-5 mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
                    {title}
                </h5>
            </a>
            <p className="mb-6 text-body text-start px-5">{description}</p>
            <section className="flex justify-between pb-4 px-4">
                <h3>${price}</h3>
                <h3>{typesof}</h3>
                
            </section>

        </div>
    </div>
  )
}

export default ResCard