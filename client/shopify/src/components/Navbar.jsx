import {  ShoppingCart } from "@mui/icons-material";
import { Avatar,Badge } from "@mui/material";
import { Search, ShoppingCartOutlined } from "@mui/icons-material";
import React from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/apiCalls";
import { userRequest } from "../requestMethods";

//import { useDispatch, useSelector } from "react-redux";

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
  padding: 20px;
  
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  //const { isFetching, error } = useSelector((state) => state.user);



  const manage = (e) => {
  
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
              price: item.price
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
              price: item.price
            })),
          });
          console.log("New cart:", newCart);
        }
      } catch (error) {
        console.log("Error handling click:", error);
      }
    };

    console.log("loggingout");
    logout(dispatch);
     
    
    handleClick();
  };
  const quantity = useSelector(state=>state.cart.quantity)
  const img=useSelector(state=>state.user.currentUser?state.user.currentUser.img:"");
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language style={{color:'#04e762'}}>EN</Language>
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "#04e762", fontSize: 16 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Logo style={{color:'#04e762'}}>VASCO.</Logo>
        </Center>
        <Right>
        <Link style={{ color:'#04e762', textDecoration: 'none',outline: 'none'}} to="/register">
          <MenuItem>REGISTER</MenuItem>
          </Link>
          <Link  style={{ color:'#04e762',textDecoration: 'none',outline: 'none'}} to="/login">
          <MenuItem>SIGN IN</MenuItem>
          </Link>
          <Link style={{ color:'#04e762',textDecoration: 'none',outline: 'none'}} to="/cart">
          <MenuItem>
             <Badge badgeContent={quantity} color="info"> 
             <ShoppingCartOutlined/>
           </Badge>
          </MenuItem>
          </Link>
          <MenuItem>
          <button style={{backgroundColor:'black',color:'#04e762',border:'none'}} onClick={()=>manage() }>Logout</button>
          </MenuItem>
          <MenuItem>
          
          <Avatar src={img} />
          
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
