import signup from "../../assets/LoginSingup/signup.jpg";
import { IoArrowBackSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  // it get the value one by one character (e.target)
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // Used this because don't want the brower refesh. why ? when refresh all code will be empty so we can't get data
  function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.find(
      (user) => user.email === formData.email
    );

    if (emailExists) {
      alert("This email already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    users.push(newUser);

    console.log(users);
    console.log(JSON.stringify(users, null, 2));


    localStorage.setItem("users", JSON.stringify(users));

    alert("Register successful");

    navigate("/login");
  }

  return (
    <div
      className="bg-cover bg-no-repeat bg-center h-screen overflow-hidden fixed inset-0 justify-center items-center flex"
      style={{ backgroundImage: `url(${signup})` }}
    >
      <NavLink to="/">
        <IoArrowBackSharp className="text-white size-8 top-5 left-5 absolute" />
      </NavLink>

      <form onSubmit={handleSubmit} className="w-sm h-fit lg:mx-16 mx-4 bg-white px-6 rounded-lg"  >

        <h3 className="text-2xl flex justify-center mb-4 mt-8"> Create Your Account </h3>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-heading">  Full name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm block w-full px-3 py-2.5 shadow"
            placeholder="Full name"
            required />
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-heading"> Your email </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm block w-full px-3 py-2.5 shadow"
            placeholder="Email"
            required/>
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-heading"> Phone number </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm block w-full px-3 py-2.5 shadow"
            placeholder="Phone number"
            required />
        </div>

        <div className="flex gap-2 mb-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-heading"> Password </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border py-2.5 px-3 rounded-sm w-full"
              placeholder="Password"
              required />
          </div>

          <div>

            <label className="block mb-2 text-sm font-medium text-heading"> Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border py-2.5 px-3 rounded-sm w-full"
              placeholder="Confirm Password"
              required />
          </div>
        </div>

        <div className="flex items-start mb-5">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4 border rounded-sm"
            required/>

          <p className="ms-2 text-sm font-medium text-start text-heading select-none">Agree to the{" "}
              <a href="#" className="text-primary-Blue hover:underline">Terms and Conditions </a>{" "} and privacy policies of Azurea Luxury Resorts.
          </p>

        </div>

        <button type="submit"
          className="text-white bg-primary-Blue w-full rounded-md hover:scale-105 mb-7 font-medium text-sm px-4 py-2.5" >
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUp;
