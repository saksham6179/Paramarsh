import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

import { defaultAvatars } from "../utils/avatar";

export default function Auth() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [isLogin, setIsLogin] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    is_doctor: false,
    specialization: "",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // RANDOM AVATAR
  const getRandomAvatar = () => {
    const randomIndex =
      Math.floor(
        Math.random() *
          defaultAvatars.length
      );

    return defaultAvatars[
      randomIndex
    ];
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // LOGIN
      if (isLogin) {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        // GLOBAL LOGIN
        login(res.data.user);

        alert("Login successful 🚀");

        navigate("/assistant");
      }

      // REGISTER
      else {
        // RANDOM PROFILE
        const avatar =
          getRandomAvatar();

        const payload = {
          ...form,
          avatar,
        };

        const res = await axios.post(
          "http://127.0.0.1:8000/api/register",
          payload
        );

        // GLOBAL LOGIN
        login(res.data.user);

        alert(
          "Registration successful 🚀"
        );

        navigate("/assistant");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center 
      items-center min-h-screen px-4"
    >
      <div className="w-full max-w-md">

        {/* CARD */}
        <div
          className="bg-white/30 
          backdrop-blur-2xl 
          border border-white/40 
          shadow-[0_20px_60px_rgba(0,0,0,0.1)] 
          rounded-3xl p-8 
          flex flex-col gap-6"
        >

          {/* TITLE */}
          <div className="text-center">

            <h2 className="text-xl font-semibold">
              {isLogin
                ? "Welcome Back 👋"
                : "Create Account ✨"}
            </h2>

            <p className="text-sm text-gray-500">
              {isLogin
                ? "Login to continue"
                : "Signup to start your health journey"}
            </p>

          </div>

          {/* TOGGLE */}
          <div
            className="flex bg-white/40 
            rounded-full p-1"
          >

            <button
              type="button"
              onClick={() =>
                setIsLogin(true)
              }
              className={`flex-1 py-1 
              rounded-full text-sm transition ${
                isLogin
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                setIsLogin(false)
              }
              className={`flex-1 py-1 
              rounded-full text-sm transition ${
                !isLogin
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Signup
            </button>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white/50 
                px-4 py-2 rounded-xl 
                outline-none text-sm"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-white/50 
              px-4 py-2 rounded-xl 
              outline-none text-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="bg-white/50 
              px-4 py-2 rounded-xl 
              outline-none text-sm"
            />

            {/* DOCTOR */}
            {!isLogin && (
              <div
                className="flex items-center 
                justify-between 
                bg-white/30 rounded-2xl 
                px-4 py-3"
              >

                <span className="text-sm text-gray-700">
                  Register as Doctor
                </span>

                <input
                  type="checkbox"
                  name="is_doctor"
                  checked={
                    form.is_doctor
                  }
                  onChange={
                    handleChange
                  }
                  className="w-4 h-4"
                />

              </div>
            )}

            {/* SPECIALIZATION */}
            {!isLogin &&
              form.is_doctor && (
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={
                    form.specialization
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-white/50 
                  px-4 py-2 rounded-xl 
                  outline-none text-sm"
                />
              )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r 
              from-blue-500 
              to-indigo-600 
              text-white py-2 
              rounded-full shadow-md 
              hover:scale-105 transition
              disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}