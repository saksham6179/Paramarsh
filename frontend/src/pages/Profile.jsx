import {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";

import {
  defaultAvatars,
} from "../utils/avatar";

import {
  useAuth,
} from "../context/AuthContext";

export default function Profile() {
  const {
    user,
    updateUser,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [showPicker, setShowPicker] =
    useState(false);

  const pickerRef = useRef();

  const [form, setForm] =
    useState({
      id: "",
      name: "",
      email: "",
      is_doctor: false,
      specialization: "",
      available: true,
      avatar:
        defaultAvatars[0],
    });

  // LOAD USER
  useEffect(() => {
    if (!user) return;

    setForm({
      id: user.id || "",

      name: user.name || "",

      email: user.email || "",

      is_doctor:
        user.is_doctor || false,

      specialization:
        user.specialization || "",

      available:
        user.available ?? true,

      avatar:
        user.avatar ||
        defaultAvatars[0],
    });
  }, [user]);

  // CLOSE PICKER
  useEffect(() => {
    const handleClickOutside = (
      e
    ) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(
          e.target
        )
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // SAVE PROFILE
  const handleSave =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.put(
            "http://127.0.0.1:8000/api/update-profile",
            form
          );

        const updatedUser =
          res.data.user;

        // ✅ UPDATE GLOBAL AUTH
        updateUser(
          updatedUser
        );

        // ✅ UPDATE LOCAL FORM
        setForm(updatedUser);

        alert(
          "Profile updated successfully 🚀"
        );
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!user) return null;

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-md">

        <div
          className="bg-white/30 
          backdrop-blur-2xl 
          border border-white/40 
          shadow-xl rounded-3xl 
          p-6 flex flex-col gap-6"
        >

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3 relative">

            <img
              src={form.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />

            <button
              onClick={() =>
                setShowPicker(
                  !showPicker
                )
              }
              className="text-xs text-blue-600 hover:underline"
            >
              Change Avatar
            </button>

            {/* PICKER */}
            {showPicker && (
              <div
                ref={pickerRef}
                className="absolute top-28 z-50 
                bg-white/90 backdrop-blur-xl 
                border border-white/40 
                shadow-xl rounded-2xl 
                p-4 grid grid-cols-6 gap-3"
              >

                {defaultAvatars.map(
                  (avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt="avatar"
                      onClick={() => {
                        setForm(
                          (
                            prev
                          ) => ({
                            ...prev,

                            avatar,
                          })
                        );

                        setShowPicker(
                          false
                        );
                      }}
                      className={`w-12 h-12 rounded-full 
                      cursor-pointer transition border ${
                        form.avatar ===
                        avatar
                          ? "border-blue-500 ring-2 ring-blue-300 scale-110"
                          : "hover:border-blue-400 hover:scale-105"
                      }`}
                    />
                  )
                )}

              </div>
            )}

          </div>

          {/* NAME */}
          <div>

            <label className="text-sm text-gray-600">
              Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm(
                  (
                    prev
                  ) => ({
                    ...prev,

                    name:
                      e.target
                        .value,
                  })
                )
              }
              className="w-full mt-1 px-3 py-2 
              rounded-xl bg-white/50 
              outline-none text-sm"
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              value={form.email}
              onChange={(e) =>
                setForm(
                  (
                    prev
                  ) => ({
                    ...prev,

                    email:
                      e.target
                        .value,
                  })
                )
              }
              className="w-full mt-1 px-3 py-2 
              rounded-xl bg-white/50 
              outline-none text-sm"
            />

          </div>

          {/* DOCTOR */}
          <div className="flex items-center justify-between">

            <span className="text-sm">
              I am a Doctor
            </span>

            <button
              onClick={() =>
                setForm(
                  (
                    prev
                  ) => ({
                    ...prev,

                    is_doctor:
                      !prev.is_doctor,
                  })
                )
              }
              className={`w-12 h-6 rounded-full 
              flex items-center px-1 transition ${
                form.is_doctor
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >

              <div
                className={`w-4 h-4 bg-white rounded-full transition ${
                  form.is_doctor
                    ? "translate-x-6"
                    : ""
                }`}
              ></div>

            </button>

          </div>

          {/* SPECIALIZATION */}
          {form.is_doctor && (
            <div>

              <label className="text-sm text-gray-600">
                Specialization
              </label>

              <input
                value={
                  form.specialization
                }
                onChange={(e) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,

                      specialization:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="e.g. Cardiologist"
                className="w-full mt-1 px-3 py-2 
                rounded-xl bg-white/50 
                outline-none text-sm"
              />

            </div>
          )}

          {/* AVAILABLE */}
          {form.is_doctor && (
            <div className="flex items-center justify-between">

              <span className="text-sm">
                Available
              </span>

              <button
                onClick={() =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,

                      available:
                        !prev.available,
                    })
                  )
                }
                className={`w-12 h-6 rounded-full 
                flex items-center px-1 transition ${
                  form.available
                    ? "bg-green-500"
                    : "bg-red-400"
                }`}
              >

                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    form.available
                      ? "translate-x-6"
                      : ""
                  }`}
                ></div>

              </button>

            </div>
          )}

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-2 bg-gradient-to-r 
            from-blue-500 to-indigo-600 
            text-white py-2 rounded-2xl 
            shadow-md hover:scale-[1.02] 
            transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}