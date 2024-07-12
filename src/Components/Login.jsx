import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";

import SignInWithGoogle from "./SignInWithGoogle";
import { auth } from "../helpers/firebase";

function Login() {
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-beige">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={loginUser.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={loginUser.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>
          New user{" "}
          <Link to="/register" className="text-blue-500">
            Register Here
          </Link>
        </p>
        <p className="mt-2">--Or continue with--</p>
      </div>
      <SignInWithGoogle />
    </div>
  );
}

export default Login;
