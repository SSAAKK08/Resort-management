
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Footer, Navbar } from "flowbite-react"
import Home from "./components/home/Home";
import Booking from "./components/booking/Booking"
import Restaurant from "./components/restaurant/Restaurant"
import About from "./components/About/About"
import Login from "./components/signUp&Login/Login"
import SignUp from "./components/signUp&Login/SignUp"
import Activity from "./components/activite/Activity";
import Promotion from "./components/promotion/Promotion";
import DetailRoom from "./components/DetailRoom/DetailRoom";

function App() {
  return (
    <BrowserRouter>
        <Navbar/>
        <Footer/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/booking" element={<Booking/>}/>
            <Route path="/restaurant" element={<Restaurant/>}/>
            <Route path="/activites" element={<Activity/>}/>
            <Route path="/promotion" element={<Promotion/>}/>            
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signUp" element={<SignUp/>}/>
            <Route path="/rooms/:id" element={<DetailRoom />} />
          

        </Routes>
    </BrowserRouter>
  )
}

export default App


