import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";

import SignInWithGoogle from "./SignInWithGoogle";
import { auth } from "../helpers/firebase";

function Login({ setBurgerToggle, burgerToggle }) {
  const navigate = useNavigate();

  const [loginUser, setLoginNewUser] = useState({ password: "", email: "" });

  const handleChange = (e) => {
    setLoginNewUser({ ...loginUser, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginUser;
    try {
      // Sign in to firebase

      const loggedUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      const token = await loggedUser.user.getIdToken();
      localStorage.setItem("token", token);
      setLoginNewUser({ password: "", email: "" });

      toast.success("User logged in Successfully", {
        position: "top-center",
      });
      navigate("/home");
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    setBurgerToggle(false);
  }, [setBurgerToggle]);

  console.log(burgerToggle);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#713A3A]">
      <div className="w-full max-w-md bg-[#FFDAB9] p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6 text-center">Login</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>

            <label htmlFor="email" className="block text-sm font-medium text-gray-700">

              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={loginUser.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>

            <label htmlFor="password" className="block text-sm font-medium text-gray-700">

              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={loginUser.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7EB098] hover:bg-[#8CC7AB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">

            New user? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register Here</Link>

          </p>
          <p className="mt-2 text-sm">--Or continue with--</p>
        </div>

        <div className="mt-4 flex justify-center items-center">
          <SignInWithGoogle/>
        </div>
      </div>
    </div>
  );
}

export default Login;
