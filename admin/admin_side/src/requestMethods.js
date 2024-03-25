import axios from "axios";

const BASE_URL = "http://localhost:3000/api/";
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const accessToken = currentUser?currentUser.accessToken:"vishesh";
localStorage.setItem("accessToken", accessToken);
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${accessToken}` },
});
