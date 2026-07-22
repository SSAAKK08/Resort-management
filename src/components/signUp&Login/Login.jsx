import signup from "../../assets/LoginSingup/signup.jpg";
import { IoArrowBackSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const loginUser = users.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password
    );

    if (!loginUser) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(loginUser));

    // Tell the Navbar that the login status has changed.
    window.dispatchEvent(new Event("loginStatusChanged"));

    alert("Login successful");

    navigate("/");
  }

  return (
    <div className="bg-cover bg-no-repeat bg-center h-screen overflow-hidden fixed inset-0 justify-center items-center flex"
      style={{ backgroundImage: `url(${signup})` }}
    >
      <NavLink to="/">
        <IoArrowBackSharp className="text-white size-8 top-5 left-5 absolute" />
      </NavLink>

      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-white px-6 rounded-lg pt-3 h-auto overflow-y-auto max-h-[90vh]"
      >
        <h3 className="text-xl flex justify-center mb-4">Login Account</h3>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-heading">
            Your email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm block w-full px-3 py-2.5 shadow"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-heading"> Password </label>
          <input type="password" name="password"  value={formData.password} onChange={handleChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm block w-full px-3 py-2.5 shadow"
            placeholder="Password" required />
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <input type="checkbox"  name="remember" checked={formData.remember} onChange={handleChange} className="w-4 h-4 border rounded-sm"/>
            <h4>Remember me </h4>

          </div>

          <a href="#" className="text-primary-Blue hover:underline text-sm"> Forgot password</a>
        </div>

        <button
          type="submit"
          className="text-white bg-primary-Blue w-full rounded-md hover:scale-105 mb-7 font-medium text-sm px-4 py-2.5"
        >Submit
        </button>
      </form>
    </div>
  );
}

export default Login;