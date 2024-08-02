import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../helpers/firebase";
import { register } from "../helpers/register";

function Register({ setNavBarToggle }) {
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

  useEffect(() => {
    setNavBarToggle(false);
  }, []);

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
          // toast.success("User Registered Successfully!!", {
          //   position: "top-center",
          // });
          navigate("/home");
          // } else {
          //   toast.error("User Not Found", {
          //     position: "top-center",
          //   });
        }
      }
    } catch (error) {
      console.log(error.message);

      // toast.error(error.message, {
      //   position: "bottom-center",
      // });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('../src/assets/family_kitchen.jpg')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-opacity-70"></div>

      <div className="relative w-full max-w-md p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-30">
        <h3 className="text-2xl font-bold mb-6 text-center lexend-exa text-white">
          Sign Up
        </h3>

        <form onSubmit={handleRegister} className="space-y-6 lexend-exa">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-white"
            >
              First Name
            </label>

            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newUser.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-40 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-white"
            >
              Last Name
            </label>

            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newUser.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-40 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-40 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-white"
            >
              Nickname (Optional)
            </label>

            <input
              type="text"
              id="nickname"
              name="nickname"
              value={newUser.nickname}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-40 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-40 text-gray-900"
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

        <div className="mt-6 text-center lexend-exa text-white">
          <p className="text-sm">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-300 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
