import { useState } from "react"
function ReverseTable() {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
    alert("Please login first before reserving a table.");
    return;
    }

    const [bookTable, setBookTable] = useState({
        fullName: "",
        email: "",
        date: "",
        guest: "",
        time: "",
        phone: "",
        require: ""
    });

    function handleChange(e){
        const {name, value} = e.target;

        setBookTable({
            ...bookTable, 
            [name]: value,

        });
    }

    function handleSubmit(e){
        e.preventDefault();

        const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

        const newReservation = {
            id: Date.now(),
            ...bookTable,
        };

        const updateReservations = [
            ...reservations,
            newReservation
        ]

        localStorage.setItem("reservations", JSON.stringify(updateReservations));

        alert("Reservation successfully created.");

        setBookTable({
            fullName: "",
            email: "",
            date: "",
            guest: "",
            time: "",
            phone: "",
            require: "",
        });
    }

  return (
    <div>
        <form onSubmit={handleSubmit} className="max-w-md  bg-white border px-8 rounded-lg py-2 h-auto lg:mx-16 mx-3 ">

                <h2 className="text-3xl text-primary-Blue font-semibold mb-3 ">Reserve Table</h2>
                <p className="text-lg flex justify-center mb-7">Experience the sunset with an unforgettable culinary
                    performance. We recommend booking 48 hours in advance for preferred seating. </p>

                <div className="flex gap-2 mb-5">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-heading ">FullName</label>
                        <input id="name" type="text" name="fullName" value={bookTable.fullName} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Full Name" />
                    </div>

                    <div >
                        <label htmlFor="Email" className="block mb-2 text-sm font-medium text-heading ">Email Address</label>
                        <input id="Email" type="email" name="email" value={bookTable.email} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
                    </div>
                </div>

                <div className="flex gap-2 mb-5">
                    <div>
                        <label htmlFor="date" className="block mb-2 text-sm font-medium text-heading ">Date</label>
                        <input id="date" type="date" name="date" value={bookTable.date} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" />
                    </div>

                    <div>
                        <label htmlFor="guest" className="block mb-2 text-sm font-medium text-heading ">Guest</label>
                        <input id="guest" type="number" name="guest" min={1} value={bookTable.guest} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Guest" />
                    </div>

                    <div >
                        <label htmlFor="time" className="block mb-2 text-sm font-medium text-heading ">Time</label>
                        <input type="Time" id="time" name="time" value={bookTable.time} onChange={handleChange} className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
                    </div>
                </div>

                <div className="mb-5">
                    <label  htmlFor="Phone" className="block mb-2 text-sm font-medium text-heading ">Phone number</label>
                    <input type="tel" id="phone" pattern="[0-9]{10}" name="phone" value={bookTable.phone} onChange={handleChange}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
                    placeholder="Phone number" required="" />
                </div>

                <div className="mb-5 relative ">

                    <input type="text" id="specialRequest" name="require" onChange={handleChange}
                    className="peer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm focus:ring-brand focus:border-brand block w-full px-3 py-8 shadow placeholder:text-body"
                    required="" />
                    <label htmlFor="specialRequest" className="left-3 top-2 text-sm text-body transition-all absolute peer-placeholder-shown:top-6   peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-heading">Requirement </label>
                </div>
                

                <button type="submit"
                    className="text-white  bg-primary-Blue w-full rounded-md hover:scale-105 mb-7 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    >Confirm Reservation
                </button>
            </form>
    </div>
  )
}

export default ReverseTable;




// function ReverseTable() {




    
//   return (
//     <div>
//         <form className="max-w-md  bg-white border px-8 rounded-lg py-2 h-auto lg:mx-16 mx-3 ">

//                 <h2 className="text-3xl text-primary-Blue font-semibold mb-3 ">Reserve Table</h2>
//                 <p className="text-lg flex justify-center mb-7">Experience the sunset with an unforgettable culinary
//                     performance. We recommend booking 48 hours in advance for preferred seating. </p>

//                 <div className="flex gap-2 mb-5">
//                     <div>
//                         <label htmlFor="name" className="block mb-2 text-sm font-medium text-heading ">FullName</label>
//                         <input id="name" type="text" className="border py-2.5 px-3 rounded-sm w-full" placeholder="Full Name" />
//                     </div>

//                     <div >
//                         <label htmlFor="Email" className="block mb-2 text-sm font-medium text-heading ">Email Address</label>
//                         <input id="Email" type="email" className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
//                     </div>
//                 </div>

//                 <div className="flex gap-2 mb-5">
//                     <div>
//                         <label htmlFor="date" className="block mb-2 text-sm font-medium text-heading ">Date</label>
//                         <input id="date" type="date" className="border py-2.5 px-3 rounded-sm w-full" />
//                     </div>

//                     <div>
//                         <label htmlFor="guest" className="block mb-2 text-sm font-medium text-heading ">Guest</label>
//                         <input id="guest" type="number" className="border py-2.5 px-3 rounded-sm w-full" placeholder="Guest" />
//                     </div>

//                     <div >
//                         <label htmlFor="time" className="block mb-2 text-sm font-medium text-heading ">Time</label>
//                         <input type="Time" id="time" className="border py-2.5 px-3 rounded-sm w-full" placeholder="Email" />
//                     </div>
//                 </div>

//                 <div className="mb-5">
//                     <label  htmlFor="Phone" className="block mb-2 text-sm font-medium text-heading ">Phone number</label>
//                     <input type="tel" id="phone" pattern="[0-9]{10}" 
//                     className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm  focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body"
//                     placeholder="Phone number" required="" />
//                 </div>

//                 <div className="mb-5 relative ">

//                     <input type="text" id="specialRequest"
//                     className="peer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm focus:ring-brand focus:border-brand block w-full px-3 py-8 shadow placeholder:text-body"
//                     required="" />
//                     <label htmlFor="specialRequest" className="left-3 top-2 text-sm text-body transition-all absolute peer-placeholder-shown:top-6   peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-heading">Requirement </label>
//                 </div>
                

//                 <button type="submit"
//                     className="text-white  bg-primary-Blue w-full rounded-md hover:scale-105 mb-7 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
//                     >Confirm Reservation
//                 </button>
//             </form>
//     </div>
//   )
// }

// export default ReverseTable

