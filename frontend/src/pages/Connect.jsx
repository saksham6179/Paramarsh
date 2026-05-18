import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  getUserAvatar,
} from "../utils/avatar";

import {
  useAuth,
} from "../context/AuthContext";

export default function Connect() {
  const navigate = useNavigate();

  const { user } =
    useAuth();

  const [search, setSearch] =
    useState("");

  const [visibleCount, setVisibleCount] =
    useState(9);

  const [doctors, setDoctors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH DOCTORS
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            "http://127.0.0.1:8000/api/doctors"
          );

        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // FILTER
  const filteredDoctors =
    doctors.filter((doc) => {
      // 🚫 NO SELF CHAT
      if (doc.id === user?.id) {
        return false;
      }

      return (
        doc.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        (
          doc.specialization || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    });

  if (!user) return null;

  return (
    <div className="flex justify-center mt-6 px-4">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-xl font-semibold text-gray-700">
            Connect with Doctors
          </h1>

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setVisibleCount(9);
            }}
            className="px-4 py-1.5 rounded-full 
            text-sm border outline-none 
            bg-white/40 backdrop-blur"
          />

        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-sm text-gray-500">
            Loading doctors...
          </p>
        )}

        {/* GRID */}
        <div
          className="grid grid-cols-1 
          sm:grid-cols-2 md:grid-cols-3 gap-6"
        >

          {filteredDoctors
            .slice(0, visibleCount)
            .map((doc) => (

              <div
                key={doc.id}
                className="group relative 
                bg-white/30 backdrop-blur-2xl 
                border border-white/40 
                shadow-lg rounded-3xl 
                p-5 flex flex-col gap-4 
                transition duration-300 
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] 
                hover:scale-[1.04]"
              >

                {/* GLOW */}
                <div
                  className="absolute inset-0 rounded-3xl 
                  opacity-0 group-hover:opacity-100 
                  transition duration-300 
                  bg-gradient-to-br 
                  from-blue-200/20 to-indigo-200/20 
                  blur-xl"
                ></div>

                {/* TOP */}
                <div className="flex items-center gap-3 relative z-10">

                  {/* AVATAR */}
                  <div className="relative">

                    <img
                      src={getUserAvatar(
                        doc
                      )}
                      alt="avatar"
                      className="w-12 h-12 rounded-full 
                      object-cover shadow-md"
                    />

                    {/* STATUS */}
                    <span
                      className={`absolute bottom-0 right-0 
                      w-3 h-3 rounded-full border-2 
                      border-white ${
                        doc.available
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>

                  </div>

                  {/* INFO */}
                  <div>

                    <h2 className="font-semibold text-gray-800 text-sm">
                      {doc.name}
                    </h2>

                    <p className="text-xs text-indigo-600 font-medium">
                      {doc.specialization ||
                        "Doctor"}
                    </p>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-gray-500 leading-relaxed relative z-10">
                  Helping patients with professional healthcare guidance.
                </p>

                {/* INFO */}
                <div className="flex items-center justify-between text-xs relative z-10">

                  <span
                    className="flex items-center gap-1 
                    bg-yellow-100 text-yellow-700 
                    px-2 py-1 rounded-full"
                  >
                    ⭐ 5.0
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      doc.available
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {doc.available
                      ? "Available"
                      : "Busy"}
                  </span>

                </div>

                {/* BUTTON */}
                <button
                  disabled={!doc.available}
                  onClick={() =>
                    navigate("/chats", {
                      state: {
                        doctor: doc,
                      },
                    })
                  }
                  className={`mt-2 py-1.5 rounded-full 
                  text-sm font-medium transition 
                  relative z-10 ${
                    doc.available
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 shadow-md"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {doc.available
                    ? "Connect"
                    : "Unavailable"}
                </button>

              </div>
            ))}

        </div>

        {/* SHOW MORE */}
        {visibleCount <
          filteredDoctors.length && (
          <div className="flex justify-center mt-6">

            <button
              onClick={() =>
                setVisibleCount(
                  (prev) =>
                    prev + 6
                )
              }
              className="px-6 py-2 rounded-full 
              bg-white/40 backdrop-blur 
              border border-white/30 shadow 
              text-sm hover:scale-105 transition"
            >
              Show More
            </button>

          </div>
        )}

      </div>
    </div>
  );
}