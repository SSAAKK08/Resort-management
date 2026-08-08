'use client';

import signup from "../../assets/LoginSingup/signUp.jpg";
import { IoArrowBackSharp } from "react-icons/io5";
import NavLink from "../navigation/AppLink";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.email, password: formData.password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Invalid email or password.");
      window.dispatchEvent(new Event("sessionChanged"));
      router.replace(payload.user?.role?.type === "admin" ? "/admin" : "/profile");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-cover bg-no-repeat bg-center h-screen overflow-hidden fixed inset-0 justify-center items-center flex"
      style={{ backgroundImage: `url(${signup.src})` }}
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

        {error && <p className="mb-3 text-sm text-red-600" role="alert">{error}</p>}

        <button disabled={submitting}
          type="submit"
          className="text-white bg-primary-Blue w-full rounded-md hover:scale-105 mb-7 font-medium text-sm px-4 py-2.5"
        >{submitting ? "Signing in..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Login;
