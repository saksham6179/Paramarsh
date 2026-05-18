import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // LOAD USER
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const parsedUser =
          JSON.parse(storedUser);

        // ✅ VALID USER CHECK
        if (
          parsedUser &&
          parsedUser.id &&
          parsedUser.email
        ) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(
            "user"
          );
        }
      }
    } catch (error) {
      console.log(error);

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = (userData) => {
    if (!userData) return;

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");

    setUser(null);
  };

  // UPDATE USER
  const updateUser = (
    updatedData
  ) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        ...updatedData,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// CUSTOM HOOK
export function useAuth() {
  return useContext(AuthContext);
}