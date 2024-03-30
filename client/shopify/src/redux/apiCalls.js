import { loginFailure, loginStart, loginSuccess,logoutSuccess } from "./userRedux";
import {clearCart} from "./cartRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    console.log("Token:", "vishesh");
     console.log(user);
    const res = await publicRequest.post("/auth/login", user);
    console.log(res);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.log(err);
     dispatch(loginFailure({errorMessage:err.response.data.error}));
  }
};

export const logout = (dispatch, user) => {
  dispatch(logoutSuccess());
  dispatch(clearCart());
  
};



