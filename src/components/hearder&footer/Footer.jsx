import { NavLink } from "react-router-dom"
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <div>
        
        <footer className="bg-accent-text w-full">
            <div className=" container mx-auto w-full  p-4 py-6 lg:py-8">
                <div className="lg:mx-8">

                
                    <div className="grid grid-cols-12 lg:gap-8 gap-3">

                        <div className="mb-6  lg:col-span-3">

                                <img src={logo} className=""  alt="Sea Breeze logo"  />
                          
                        </div>

                        <div className="flex col-span-12 lg:col-span-5 lg:gap-20 gap-12 mx-12">

                            <div className="lg:col-span-2 col-span-12 ">
                                <h2 className="mb-6 text-sm text-primary-Blue font-semibold uppercase">Quick navigate</h2>
                                <ul className="text-body font-medium">
                                    
                                    <li>
                                        <NavLink to={"/"}>Home</NavLink>
                                    </li>

                                    <li>
                                        <NavLink to={"/booking"}>Rooms</NavLink>
                                        
                                    </li>

                                    <li>
                                        <NavLink to={"/restaurant"}>Restaurant</NavLink>
                                        
                                    </li>

                                    <li>
                                        <NavLink to={"/activites"}>Activites</NavLink>
                                        
                                    </li>

                                    <li>
                                        <NavLink to={"/promotions"}>Promotions</NavLink>
                                        
                                    </li>

                                    <li>
                                        <NavLink to={"/about"}>About</NavLink>
                                        
                                    </li>
                                </ul>
                            </div>

                            <div className="lg:col-span-3 col-span-12 text-center ">
                                <h2 className="mb-6 text-sm text-primary-Blue font-semibold uppercase ">Quick navigate</h2>
                                <ul className="text-body font-medium">
                                    
                                    <li>
                                        <a href="#" className="hover:underline ">Home</a>
                                    </li>

                                    <li>
                                        <a href="#" className="hover:underline ">Rooms</a>
                                    </li>

                                    <li>
                                        <a href="#" className="hover:underline">Restaurant</a>
                                    </li>

                                    <li>
                                        <a href="#" className="hover:underline">Activites</a>
                                    </li>

                                    <li>
                                        <a href="#" className="hover:underline">Promotions</a>
                                    </li>

                                    <li>
                                        <a href="#" className="hover:underline">About</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    
                        <div className="lg:col-span-4 col-span-12 place-items-center">
                            <h2 className="lg:mb-6 mb-2 text-sm text-center text-primary-Blue lg:mt-0 mt-3 font-semibold text-heading uppercase">Connect</h2>
                            <ul className="text-body font-medium">

                                <li>
                                    <h4>Join our exciusive circle for curated offers and resort news.</h4>
                                </li>

                                <li className="mb-4 mt-4 flex gap-1.5 place-items-center">
                                                                    
                                        <input className="border rounded-sm px-2 py-2 " placeholder="Email" type="Email"Input Email/>
                                    
                                        <button type="button" className="text-white bg-primary-Blue px-3 py-2 rounded-sm">Subscribe</button>            
                        
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-default lg:my-8" />
                <div className="flex items-center justify-between ">
                    <span className="text-sm text-body sm:text-center">
                        <h4>Sea Breeze</h4>
                    </span>

                    <div className="flex lg:mt-4 justify-end">
                        <a href="#" className="text-body hover:text-heading">
                            <svg
                                className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24}  height={24} fill="currentColor" viewBox="0 0 24 24" >
                                <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">Facebook page</span>
                        </a>

                        <a href="#" className="text-body hover:text-heading ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"  width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129
                                 1.3 17.392 17.392 0 0 0-2.868 11.662 15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 0 1-1.706-.83c.143-.106.283-.217.418-.331a11.664 11.664 0 0 0 10.118 0c.137.114.277.225.418.331-.544.328-1.116.606-1.71.832a12.58 12.58 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM8.678 14.813a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.929 1.929 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                            </svg>
                            <span className="sr-only">Discord community</span>
                        </a>

                        <a href="#" className="text-body hover:text-heading ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24}  fill="currentColor" viewBox="0 0 24 24" >
                                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </a>

                    </div>
                </div>
            </div>
        </footer>

    </div>
  )
}

export default Footer