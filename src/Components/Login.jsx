import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import familyDinner from "../../assets/family_dinner.jpg";

import SignInWithGoogle from "./SignInWithGoogle";
import { auth } from "../helpers/firebase";

function Login({ setNavBarToggle }) {
  const navigate = useNavigate();

  const [loginUser, setLoginNewUser] = useState({ password: "", email: "" });

  const handleChange = (e) => {
    setLoginNewUser({ ...loginUser, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginUser;

    try {
      const loggedUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in to Firebase Successfully");

      // store the JWT token so that you know the user is logged in.
      const token = await loggedUser.user.getIdToken();
      localStorage.setItem("token", token);

      setLoginNewUser({ password: "", email: "" });
      // toast.success("User logged in Successfully", {
      //   position: "top-center",
      // });

      // you do not have to create a login in the backend because firebase is handling it.
      // when you navigate to profile, you will see a fetch for the user.
      navigate("/home");
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  useEffect(() => {
    setNavBarToggle(false);
  }, []);

  return (
    // <div
    //   className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
    //   style={{
    //     backgroundImage: "url('../src/assets/family_dinner.jpg')",
    //   }}
    // >
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${familyDinner})`,
      }}
    >
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center text-white lexend-exa">
          Login
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white lexend-exa"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white lexend-exa"
            >
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7EB098] hover:bg-[#8CC7AB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 lexend-exa"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white lexend-exa">
            New user?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register Here
            </Link>
          </p>
          <p className="mt-2 text-sm text-white lexend-exa">
            --Or continue with--
          </p>
        </div>

        <div className="mt-4 flex justify-center items-center">
          <div className="flex justify-center items-center">
            <SignInWithGoogle className="text-white bg-[#4285F4] px-4 py-2 rounded-md shadow-md hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
