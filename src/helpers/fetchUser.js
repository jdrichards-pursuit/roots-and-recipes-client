const URL = import.meta.env.VITE_BASE_URL;

export const fetchUser = async (user, token) => {
  console.log("user:", user);
  console.log("token:", token);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // check if user exists
  const response = await fetch(`${URL}/api/auth/user/${user.uid}`, options);

  return response.json();
};
