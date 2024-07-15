import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../helpers/firebase";
import { register } from "../helpers/register";

function Register() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    nickname: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value });
  };

  const handleClearState = () => {
    setNewUser({
      email: "",
      last_name: "",
      nickname: "",
      password: "",
      first_name: "",
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(newUser);
    try {
      const { email, password, nickname } = newUser;
      // createUser in firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        nickname
      );

      // you need the JWT token to authenticate protected routes on the backend
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      const { uid, photoURL } = auth.currentUser;

      if (uid) {
        //register first
        const retrievedUser = await register(newUser, photoURL, uid);
        // no sign in the new user with signInWithEmailAndPassword
        if (retrievedUser.uid) {
          await signInWithEmailAndPassword(auth, email, password);

          handleClearState();
          toast.success("User Registered Successfully!!", {
            position: "top-center",
          });
          navigate("/home");
        } else {
          toast.error("User Not Found", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (

    <div className="min-h-screen flex flex-col justify-center items-center bg-[#713A3A]">
      <div className="w-full max-w-md bg-[#FFDAB9] p-4 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6 text-center">Sign Up</h3>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>

            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First name"
              value={newUser.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>


          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>

            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last name"
              value={newUser.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

          </div>


          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname
            </label>

            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="Enter username"
              value={newUser.nickname}
              onChange={handleChange}
              required
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
              value={newUser.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Already registered? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
