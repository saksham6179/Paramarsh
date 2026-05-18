import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import logo from "../assets/logo.png";

import { getUserAvatar } from "../utils/avatar";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();

  const navigate = useNavigate();

  const { user, logout } =
    useAuth();

  const [open, setOpen] =
    useState(false);

  const dropdownRef = useRef();

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (
      e
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // 🚫 WAIT FOR USER
  if (!user) return null;

  const navItems = [
    {
      name: "Assistant",
      path: "/assistant",
    },

    {
      name: "Chats",
      path: "/chats",
    },

    {
      name: "Connect",
      path: "/connect",
    },

    {
      name: "History",
      path: "/history",
    },

    {
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="flex justify-center mt-4">
      <div
        className="w-[90%] max-w-6xl 
        bg-white/30 backdrop-blur-xl 
        border border-white/40 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        rounded-full px-6 py-3 
        flex items-center justify-between 
        relative z-50"
      >

        {/* LOGO */}
        <div className="flex items-center gap-2">

          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 rounded-full"
          />

          <span
            className="text-blue-600 
            font-semibold text-lg"
          >
            Paramarsh
          </span>

        </div>

        {/* NAV */}
        <div
          className="flex gap-2 
          bg-white/30 px-2 py-1 
          rounded-full"
        >

          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-1 
              rounded-full text-sm 
              transition-all duration-200 ${
                location.pathname ===
                item.path
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-700 hover:bg-white/40 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          ))}

        </div>

        {/* PROFILE */}
        <div
          className="relative"
          ref={dropdownRef}
        >

          <img
            src={getUserAvatar(user)}
            alt="profile"
            onClick={() =>
              setOpen(!open)
            }
            className="w-9 h-9 rounded-full 
            border cursor-pointer 
            hover:scale-105 transition"
          />

          {/* DROPDOWN */}
          <div
            className={`absolute left-1/2 
            -translate-x-1/2 mt-4 
            rounded-full px-3 py-2 
            flex items-center 
            z-[999] transition-all 
            duration-200 ease-out
            ${
              open
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >

            {/* BG */}
            <div
              className="absolute inset-0 
              bg-white/25 backdrop-blur-xl 
              border border-white/40 
              rounded-full 
              shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
            ></div>

            {/* LOGOUT */}
            <div className="relative flex items-center">

              <button
                onClick={() => {
                  logout();

                  navigate("/auth");
                }}
                className="px-4 py-1 
                text-sm rounded-full 
                hover:bg-red-100/60 
                text-red-500 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}