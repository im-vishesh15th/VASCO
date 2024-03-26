import axios from "axios";

const BASE_URL = "https://vasco-2.onrender.com/api/";
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";
console.log(localStorage);
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;


const currentUser = user && JSON.parse(user).currentUser;


const accessToken = currentUser?currentUser.accessToken:"vishesh";
console.log("Token:", accessToken);
localStorage.setItem("accessToken", accessToken);

console.log(user);





export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${accessToken}` },
});
