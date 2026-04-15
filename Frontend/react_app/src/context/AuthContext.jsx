import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


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


  const login = async (credentials) => {

    await loginUser(credentials);

    await loadUser();
  };

  const logout = async () => {

    await logoutUser();
    setUser(null);

  };

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


export const useAuth = () => {
  return useContext(AuthContext);
};
