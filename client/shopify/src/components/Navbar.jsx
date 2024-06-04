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

const Container = styled.div`
  height: 60px;
  margin-bottom: 20px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  background-color: black;
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
  position: relative;
  border: 1px solid #04e762;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
  width: auto;
  min-height: 35px;
  height: auto;
  min-width: 200px;
  border-radius: 25px;
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
  
  ${mobile({ width: "50px" })}
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
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 25px;
  border-bottom: 1px solid #ccc;
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
  background-color: black;
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

const Button = styled.button`
  padding: 10px 10px;
  font-size: 1.8rem;
  color: #04e762;
  background-color: transparent;
  border: 2px solid #fff;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #3b3838;
    color: #ff0059;
  }
  ${mobile({ fontSize: "1.2rem", padding: "10px 30px" })}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <NavLink onClick={() => history.push("/")} style={{ color: "#04e762" }} to="/">
                Home
              </NavLink>
            </li>
            {currentUser && (
              <li>
                <NavLink
                  onClick={() => history.push(`/orders/find/${currentUser._id}`)}
                  style={{ color: "#04e762" }}
                  to={`/orders/find/${currentUser._id}`}
                >
                  My Orders
                </NavLink>
              </li>
            )}
            <li>
              <NavLink onClick={() => history.push("/login")} style={{ color: "#04e762" }} to="/login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink onClick={() => history.push("/register")} style={{ color: "#04e762" }} to="/register">
                Register
              </NavLink>
            </li>
            <li>
              <Link style={{ color: "#04e762" }} to="/cart">
                <Badge badgeContent={quantity} color="info">
                  <ShoppingCartOutlined style={{ fontSize: "25px" }} />
                </Badge>
              </Link>
            </li>
            {currentUser && (
              <li>
                <Button onClick={manage}>Logout</Button>
              </li>
            )}
          </ul>
        </div>
        <div className="social-media">
          <ul className="social-media-desktop">
            <li>
              <SearchContainer>
                <Input placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                <Search style={{ color: "#04e762", fontSize: 16, marginRight: "5px" }} />
                {searchResults.length > 0 && (
                  <SearchResults>
                    {searchResults.map((result, index) => (
                      <SearchResultItem
                        key={index}
                        onClick={() => handleResultClick(result._id)}
                      >
                        <img src={result.img} alt="Product" />
                        <span>{result.title.slice(0, 40) + "..."}</span>
                      </SearchResultItem>
                    ))}
                  </SearchResults>
                )}
              </SearchContainer>
            </li>
            <li>
              <Avatar style={{ height: "60px", width: "60px", border: "solid gray 2px", margin: "25px" }} src={img} />
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
