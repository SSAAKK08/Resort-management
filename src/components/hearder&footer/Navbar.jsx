import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import profile from "../../assets/profile.png"
import Button from "../button/Button"
import logo from "../../assets/logo.png"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/booking", label: "Room" },
  { to: "/restaurant", label: "Restaurant" },
  { to: "/activites", label: "Activities" },
  { to: "/promotion", label: "Promotion" },
  { to: "/about", label: "About" },
]

const activeCls = "block py-2 px-3 text-primary-Blue rounded bg-neutral-tertiary md:bg-transparent md:hover:text-fg-brand md:p-0"
const inactiveCls = "block py-2 px-3 text-secondary-gray-700 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-fg-brand md:p-0"

const Bar = ({ open, rotate, fade }) => (
  <span
    style={{
      display: "block",
      width: "22px",
      height: "2px",
      borderRadius: "2px",
      backgroundColor: "#374151",
      transition: "all 0.3s ease",
      transform: open ? rotate : "none",
      opacity: fade && open ? 0 : 1,
    }}
  />
)

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Get the logged-in user when the Navbar first loads.
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedInUser"))
  })

  useEffect(() => {
    function updateLoginStatus() {
      const user = JSON.parse(localStorage.getItem("loggedInUser"))
      setLoggedInUser(user)
    }

    window.addEventListener("loginStatusChanged", updateLoginStatus)
    window.addEventListener("storage", updateLoginStatus)

    return () => {
      window.removeEventListener("loginStatusChanged", updateLoginStatus)
      window.removeEventListener("storage", updateLoginStatus)
    }
  }, [])

  return (
    <nav className="bg-background fixed w-full z-20 top-0 border-b border-default">
      <div className="flex items-center justify-between mx-4 md:mx-10 p-4">
        <NavLink to="/" className="flex items-center space-x-3">
          <img src={logo} className="h-16 w-16" alt="Sea Breeze Logo" />
          <span className="text-xl text-heading font-semibold whitespace-nowrap">
            Sea Breeze
          </span>
        </NavLink>

        {/* Desktop navigation links */}
        <ul className="hidden md:flex font-medium flex-row space-x-5">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? activeCls : inactiveCls
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Show Login and Sign Up only when no user is logged in. */}
          {!loggedInUser && (
            <div className="hidden md:flex gap-2">
              <NavLink to="/login">
                <Button bg="bg-primary-Blue" text="Login" />
              </NavLink>

              <NavLink to="/signUp">
                <Button bg="bg-primary-Blue" text="Sign up" />
              </NavLink>
            </div>
          )}

          <img
            className="w-9 h-9 rounded-full cursor-pointer"
            src={profile}
            alt="User"
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg border-none bg-transparent cursor-pointer hover:bg-gray-100"
          >
            <Bar open={menuOpen} rotate="translateY(7px) rotate(45deg)" />
            <Bar open={menuOpen} fade />
            <Bar open={menuOpen} rotate="translateY(-7px) rotate(-45deg)" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-default bg-background px-4 pb-4">
          <ul className="flex flex-col gap-1 mt-3">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? activeCls : inactiveCls
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Hide mobile Login and Sign Up after a successful login. */}
          {!loggedInUser && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-default">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1"
              >
                <Button bg="bg-primary-Blue" text="Login" />
              </NavLink>

              <NavLink
                to="/signUp"
                onClick={() => setMenuOpen(false)}
                className="flex-1"
              >
                <Button bg="bg-primary-Blue" text="Sign up" />
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar


