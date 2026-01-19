import { useState, useContext } from "react";
import { loginUser } from "../api/auth.api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login=()=> {

  const [form, setForm] = useState({
    identifier: "",
    password: ""
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const res = await loginUser(form);
     console.log(res);
      setUser(res.data.user);
      const role = res.data?.user?.role;
      console.log("The role is ",role);

      const firstlogin=res.data?.user?.isFirstLogin;

      if (role === "STUDENT" && firstlogin===true) navigate("/change-password");
      else if(role==="STUDENT" && firstlogin===false)
      navigate("/student");
      else if (role === "TEACHER") navigate("/teacher");
      else if(role==="COORDINATOR") navigate("/coordinator");
      else navigate("/hod");

    }catch (err) {

 console.log("FULL ERROR OBJECT:", err);

 console.log("ERROR RESPONSE:", err.response);

 console.log("ERROR MESSAGE:", err.message);

 alert(err.response?.data?.message || err.message || "Login failed");

}

  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          placeholder="Email / Roll"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, identifier: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;