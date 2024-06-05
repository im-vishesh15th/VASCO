import React, { useState } from "react";
import "./navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";

import { NavLink, Link, useHistory } from "react-router-dom";
import { ShoppingCartOutlined, Search } from "@mui/icons-material";
import { Avatar, Badge } from "@mui/material";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/apiCalls";
import { userRequest } from "../requestMethods";

// const Container = styled.div`
//   height: 60px;
//   margin-bottom: 20px;
//   ${mobile({ height: "50px" })}
// `;

// const Wrapper = styled.div`
//   background-color: black;
//   padding: 10px 20px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   ${mobile({ padding: "10px 0px" })}
// `;

// const Left = styled.div`
//   flex: 1;
//   display: flex;
//   align-items: center;
// `;


const SearchContainer = styled.div`
  position: relative;
  border: 2px solid #04e762;
  display: flex;
  align-items: center;
  margin-right: 150px;
  
  padding: 5px;
  width: auto;
  min-height: 35px;
  height: auto;
  min-width: 200px;
  border-radius: 25px;
  transition: all 0.4s ease-in-out;


  &:hover {
    min-width: 250px;
    transition: all 0.4s ease-in-out;
    border: 4px solid #04e762;
    min-height:50px;
  }

  `;

const Input = styled.input`
  border: none;
  color: white;
  background-color: black;
  width: auto;
  min-width: 200px;
  min-height: 35px;
  height: auto;
  border-radius: 25px;
  margin-right:5px;
  padding: 10px;
  transition: all 0.4s ease-in-out;
  font-size:15px;
  
  ${mobile({ width: "50px" })}

  &:hover {
    min-width: 250px;
    transition: all 0.4s ease-in-out;
    min-height: 50px;
    font-size:20px;
   
  }
&:focus{
outline:none;
}


`;

const SearchResults = styled.div`
  position: absolute;
  top: 35px;
  background-color: white;
  width: 175%;
  max-height: 300px;
  overflow-y: auto;
  z-index: 2;
  margin-top: 23px;
  margin-left:0px;
  border-radius: 25px;
  border:1px black solid;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 25px;
  border-bottom: 1px solid black;
  cursor: pointer;

  &:hover {
    background-color: #c3c3c3e7;
  }

  img {
    border-radius: 25px;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    object-fit: contain;
  }
`;



const Logo = styled.h1`
  font-weight: bold;
  margin-right:30px;

  ${mobile({ fontSize: "24px" })}
`;

const Navbar = () => {
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.cart.quantity);
  const img = useSelector((state) => state.user.currentUser ? state.user.currentUser.img : "");
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  

  const handleSearch = async (query) => {
    try {
      const res = await userRequest.get(`/products/search?q=${query}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      handleSearch(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (productId) => {
    history.push(`/product/${productId}`);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleLogout = () => {
    if (currentUser) {
      logout(dispatch);
      history.push("/");
    }
  };

  const manage = (e) => {
    if (currentUser) {
      const handleClick = async () => {
        try {
          const existingCart = await userRequest.get(`/carts/find/${currentUser._id}`);
          if (existingCart.data) {
            if (cart.products.length === 0) {
              await userRequest.post(`/carts/delete/${existingCart.data._id}`, {});
            } else {
              await userRequest.post(`/carts/${existingCart.data._id}`, {
                userId: currentUser._id,
                products: cart.products.map((item) => ({
                  productId: item._id,
                  title: item.title,
                  quantity: item.quantity,
                  img: item.img,
                  color: item.color,
                  price: item.price,
                  uid: item.uid,
                })),
              });
            }
          } else {
            await userRequest.post("/carts", {
              userId: currentUser._id,
              products: cart.products.map((item) => ({
                productId: item._id,
                title: item.title,
                quantity: item.quantity,
                img: item.img,
                color: item.color,
                price: item.price,
                uid: item.uid,
              })),
            });
          }
        } catch (error) {
          console.log("Error handling click:", error);
        }
      };
      handleClick();
      handleLogout();
    }
  };

  return (
    <>
      <nav className="main-nav">
        <div className="logo">
          <Logo style={{ textShadow: "#eb116f 4px 4px", fontSize: "40px", color: "#04e762" }}>
            VASCO.
          </Logo>
        </div>
        <div className={showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"}>
          <ul>
          <li>
              <SearchContainer>
                <Input placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                <Search style={{ color: "#04e762", fontSize: 16 ,marginRight:"5px"}} />
                {searchResults.length > 0 && (
                  <SearchResults>
                    {searchResults.map((result, index) => (
                      <SearchResultItem
                        key={index}
                        onClick={() => handleResultClick(result._id)}
                      >
                        <img src={result.img} alt="Product" />
                        <span>{result.title.slice(0, 80) + "..."}</span>
                      </SearchResultItem>
                    ))}
                  </SearchResults>
                )}
              </SearchContainer>
            </li>
            <li>
              
              <NavLink onClick={() => history.push("/")}  className="nav_link" to="/">
                Home
              </NavLink>
            </li>
            {currentUser && (
              <li>
                <NavLink
                  onClick={() => history.push(`/orders/find/${currentUser._id}`)}
                  
                  to={`/orders/find/${currentUser._id}`}
                  className="nav_link"
                >
                  Orders
                </NavLink>
              </li>
            )}
            <li>
            {currentUser ? (
              <li>
                <NavLink onClick={manage} to="/" className="nav_link">
                Logout
              </NavLink>
              </li>
            ) :
              <NavLink onClick={() => history.push("/login")}  to="/login" className="nav_link">
                Login
              </NavLink>
              } 
            </li>
            
              {!currentUser &&
              <li>
              <NavLink onClick={() => history.push("/register")}  className="nav_link" to="/register">
                SignUp
              </NavLink>
              </li>
               }
            
            <li>
              <Link to="/cart">
                <Badge badgeContent={quantity} color="info">
                  <ShoppingCartOutlined style={{ fontSize: "30px", fontWeight:"bold",padding:"1px" }} />
                </Badge>
              </Link>
            </li>
          </ul>
        </div>
        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
              <Avatar style={{ height: "60px", width: "60px", border: "solid gray 2px", margin: "20px" }} src={img} />
            </li>
          </ul>
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu style={{ color: "#04e762" }} />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
