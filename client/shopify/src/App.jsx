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
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Fail from "./pages/Fail";
import { BackendProvider } from "./redux/BackendContext";


const App = () => {
  useEffect(() => {
    document.title = 'VASCO-UI'; // Set the initial title when the component mounts
  }, []);
  const user = useSelector((state) => state.user.currentUser);
  
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
        </BrowserRouter>
        </BackendProvider>
     
   
  );
};

export default App;
