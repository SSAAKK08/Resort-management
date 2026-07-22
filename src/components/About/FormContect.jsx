
import { useState } from "react"

function FormContect() {

    const [contect, setContext] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    function handleChange(e){
        const {name, value} = e.target;

        setContext({
            ...contect, [name] : value,
        });
    }

    function handleSubmit(e){
        e.preventDefault();

        const contectDeveloper = JSON.parse(localStorage.getItem("contect")) || [];

        contectDeveloper.push(contect);

        localStorage.setItem("contect", JSON.stringify(contectDeveloper));
        
        alert("Contect successfully.");

    }


  return (
    <div>
        <form onSubmit={handleSubmit} className="lg:w-xl w-sm h-fit lg:mx-0.5 mx-6 bg-white lg:mt-0 mt-6 px-6 rounded-lg border p-5">

                
                <h3 className="text-2xl flex justify-center mb-4"> Contect Developer</h3>
                <div className="mb-2">
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-heading ">Full name</label>
                    <input type="text" name="fullName" value={contect.fullName} onChange={handleChange} id="password-alternative"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Full name" required="" />
                </div>

                <div className="flex gap-3 mb-5">
                    <div className="flex-1">
                        <label htmlFor="password-alternative" className="block mb-2 text-sm font-medium text-heading ">Email</label>
                        <input type="email" name="email" value={contect.email} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="password-alternative" className="block mb-2 text-sm font-medium text-heading ">Phone number</label>
                        <input type="number" pattern="[0-9]{10}" name="phone" value={contect.phone} onChange={handleChange} className="border py-2.5 px-3 rounded-sm  w-full" placeholder="Phone number" />
                    </div>
                </div>


                <div className="mb-3">
                    <label htmlFor="Phone number" className="block mb-2 text-sm font-medium text-heading ">Subject</label>
                    <input type="text" id="password-alternative" name="subject" value={contect.subject} onChange={handleChange}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Subject" required="" />
                </div>

                <div className="mb-5">
                    <label htmlFor="Phone number" className="block mb-2 text-sm font-medium text-heading ">Message</label>
                    <input type="text" id="password-alternative" name="message" value={contect.message} onChange={handleChange}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Message" required="" />
                </div>


                <button type="submit"
                    className="text-white bg-primary-Blue w-full rounded-md hover:scale-105 mb-3 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >Submit
                </button>
            </form>
    </div>
  )
}

export default FormContect