import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ForgotPassword from "./pages/ForgotPassword";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Success from "./pages/Success";
import ResetPassword from "./pages/ResetPassword";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import Fail from "./pages/Fail";
import { BackendProvider } from "./redux/BackendContext";
import { logout } from './redux/apiCalls'
import { useState } from "react";
import { jwtDecode } from "jwt-decode";


const App = () => {

  
  useEffect(() => {
    document.title = 'VASCO-UI'; // Set the initial title when the component mounts
  }, []);

 const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown starts from 10 seconds


  useEffect(() => {
    const checkTokenExpiry = () => {
      if (user) {
        const decodedToken = jwtDecode(user.accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired
          setPopupVisible(true); // Show the popup
        }
      }
    };

    checkTokenExpiry();
  }, [dispatch, user]);


  useEffect(() => {
    if (isPopupVisible && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval
    } else if (countdown === 0) {
      // Countdown reached zero
      dispatch(logout);
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [isPopupVisible, countdown, dispatch]);


  
  return (
    <BackendProvider>
     <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/products/:category">
            <ProductList />
          </Route>
          <Route  path="/orders/:userId">
            <Orders/>
            </Route>
          <Route path="/product/:id">
            <Product />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/fail">
            <Fail />
          </Route>
          <Route path="/success">
            <Success />
          </Route>
          <Route path="/resetPassword">
            <ResetPassword />
          </Route>
          <Route path="/forgotOtp">
            <ForgotPassword />
          </Route>
          <Route path="/login">
            {user ? <Redirect to="/" /> : <Login />}
            </Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          
        </Switch>
       {isPopupVisible && (
          <div style={popupContainerStyles}>
            <div style={popupStyles}>
              <h2 style={popupTitleStyles}>Session Expired</h2>
              <p>You will be logged out in {countdown} seconds.</p>
            </div>
          </div>
        )}
        </BrowserRouter>
        </BackendProvider>
     
   
  );
};

const popupContainerStyles = {
  position: "fixed",
  top: "20px",
  right: "20px",
  zIndex: 1000,
  animation: "slideIn 0.5s ease-in-out", // Animation for sliding in
};

// Styles for popup
const popupStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  width: "300px",
  textAlign: "center",
  color: "#333",
  border: "2px solid #f39c12", // Add a nice border color
};

// Styles for popup title
const popupTitleStyles = {
  margin: "0 0 10px 0",
  fontSize: "1.5em",
  color: "#e74c3c", // A warning color for the title
};

// Add CSS for slide-in animation

const animationStyles = `
  @keyframes slideIn {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);


export default App;
