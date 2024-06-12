import React, { useEffect } from "react";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Products from "../components/Products";
import Slider from "../components/Slider";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviousProducts } from "../redux/cartRedux";
import styled from "styled-components";

const Title = styled.h1`
  font-weight: 900;
  text-align: center;
  font-size: 4.5rem;
  margin: 30px;
  color: #000000;
  transition: all 0.3s ease-in-out;
 &:hover{
  color: #bfbfbf;
  font-size: 5rem;
  transition: all 0.5s ease-in-out;
 }
`;

const Home = () => {
  const dispatch=useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchPreviousProducts(currentUser._id));
     
    }
  }, [dispatch, currentUser]);
   

  return (
    <div>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
    <Title># Trending Products ... </Title>
      <Products/>
      <Newsletter/>
      <Footer/>
    </div>
  );
};

export default Home;
