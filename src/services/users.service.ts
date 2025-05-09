import axiosInstance from "../api/api";

export const userProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }
    const user = await axiosInstance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
};
