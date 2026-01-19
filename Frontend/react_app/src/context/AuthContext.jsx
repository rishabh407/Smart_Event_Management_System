// import { createContext, useEffect, useState } from "react";
// import { getMe } from "../api/auth.api.js";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = async () => {
//     try {
//       const res = await getMe();
//       setUser(res.data.user);
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // LOAD USER SESSION
  // ========================

  const loadUser = async () => {
    try {

      const res = await getMe();
      setUser(res.data.user);

    } catch (error) {

      setUser(null);

    } finally {

      setLoading(false);

    }
  };

  // ========================
  // LOGIN HANDLER
  // ========================

  const login = async (credentials) => {

    await loginUser(credentials);

    // Reload session from cookie
    await loadUser();
  };

  // ========================
  // LOGOUT HANDLER
  // ========================

  const logout = async () => {

    await logoutUser();
    setUser(null);

  };

  // ========================
  // AUTO LOAD ON APP START
  // ========================

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loadUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ========================
// CUSTOM HOOK
// ========================

export const useAuth = () => {
  return useContext(AuthContext);
};
