import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import Register from "./pages/register/Register";

function App() {
  useEffect(() => {
    document.title = 'VASCO-ADMIN'; // Set the initial title when the component mounts
  }, []);
  const admin = useSelector((state) => state.user.currentUser?state.user.currentUser.isAdmin:false);
  const user = useSelector((state) => state.user.currentUser);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
        {admin ? (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/newUser">
                <NewUser />
              </Route>
              <Route path="/products">
                <ProductList />
              </Route>
              <Route path="/product/:productId">
                <Product />
              </Route>
              <Route path="/newproduct">
                <NewProduct />
              </Route>
              
            </div>
          </>
        ): <Login/>}
      </Switch>
   
    </BrowserRouter>
  );
}

export default App;
