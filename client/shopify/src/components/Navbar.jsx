import React, { useState } from "react";
import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

import { NavLink } from "react-router-dom";
import {  ShoppingCart } from "@mui/icons-material";
import { Avatar,Badge } from "@mui/material";
import { Search, ShoppingCartOutlined } from "@mui/icons-material";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/apiCalls";
import { userRequest } from "../requestMethods";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  height: 60px;
  margin-bottom: 20px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
background-color:black;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid #04e762;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  color: white;
  background-color: black;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  background-color:black;
  height: 10px;
  border-radius: 20%;
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  padding: 30px;
  text-align: center;
  &:hover {
    background-color: #04e762;
  }
  
  
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {

  const history=useHistory();

  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
 

const click=(v)=>{
    console.log(v);
    history.push(`${v}`);
   window.location.reload();
  }
  const manage = (e) => {
    if(currentUser)
    {
    const handleClick = async () => {
      try {
        
        console.log(cart.products);
       
    
        const existingCart = await userRequest.get(`/carts/find/${currentUser._id}`);
        if (existingCart.data) {
          // If a cart already exists, update the existing cart
          if(cart.products.length===0)
          {
            const deleted=await userRequest.post(`/carts/delete/${existingCart.data._id}`,{});
            console.log("Deleted Cart:",deleted);
          }else{
          const updatedCart = await userRequest.post(`/carts/${existingCart.data._id}`, {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              title: item.title,
              quantity: item.quantity,
              img: item.img,
              color: item.color,
              price: item.price,
              uid: item.uid
            })),
          });
          console.log("Updated cart:", updatedCart);
        }
        } else {
          // If no cart exists, create a new one
          const newCart = await userRequest.post("/carts", {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              title: item.title,
              quantity: item.quantity,
              img: item.img,
              color: item.color,
              price: item.price,
              uid: item.uid
            })),
          });
          console.log("New cart:", newCart);
        }
      } catch (error) {
        console.log("Error handling click:", error);
      }
    };
   handleClick();
    console.log("loggingout");
    logout(dispatch);
     
    
    
    };
  };
  const quantity = useSelector(state=>state.cart.quantity)
  const img=useSelector(state=>state.user.currentUser?state.user.currentUser.img:"");
  const [showMediaIcons, setShowMediaIcons] = useState(false);


  return (
    <>
      <nav className="main-nav">
       
        <div className="logo" >
        <Logo style={{ textShadow: " #eb116f 4px 4px ",fontSize:"40px", color:'#04e762'}}>VASCO.</Logo>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink  onClick={()=>click("/")} style={{color:"#04e762"}} to="/">Home</NavLink>
            </li>
            <li>
              <NavLink onClick={()=>click("/login")} style={{color:"#04e762"}} to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink onClick={()=>click("/register")} style={{color:"#04e762"}} to="/register">Register</NavLink>
            </li>
            <li>
              <Link  style={{color:"#04e762"}} to="/cart">
             <Badge badgeContent={quantity} color="info"> 
             <ShoppingCartOutlined style={{fontSize:"25px"}}/>
           </Badge>
              </Link>
            </li>
            <li>
          <button  style={ {backgroundColor:'black',color:'#04e762',border:'solid #04e762',padding:"5px"}} onClick={()=>manage() }>Logout</button>
          </li>
          <li><Avatar style={{height: '60px', width: '60px',border:"solid gray 2px" }} src={img} /></li>
          </ul>
        </div>

        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
          
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "#04e762", fontSize: 16 }} />
          </SearchContainer>
          </li>
          <li style={{ color: "#04e762"}}>EN</li>
         
          </ul>
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu style={{color:"#04e762"}} />
            </a>
          </div>
        </div>
      </nav>

      
    </>
  );
};

export default Navbar;
